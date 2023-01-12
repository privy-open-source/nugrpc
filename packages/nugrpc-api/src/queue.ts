import type { AxiosAdapter, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import Axios from 'axios'

interface QueueJob {
  config: AxiosRequestConfig;
  priority: number;
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason: unknown) => void;
}

export interface QueueOptions {
  worker: number;
}

export default class QueueAdapter {
  protected fetch: AxiosAdapter;
  protected queue: QueueJob[];
  protected options: QueueOptions;
  protected process: number;

  constructor (adapter: AxiosAdapter, options: QueueOptions = { worker: 5 }) {
    this.fetch   = adapter
    this.options = options
    this.queue   = []
    this.process = 0
  }

  enqueue (value: QueueJob) {
    let index = 0
    let count = this.queue.length

    while (count > 0) {
      const mid  = Math.trunc(count / 2)
      const it   = index + mid
      const node = this.queue[it]

      if (value.priority > node.priority) {
        index  = it + 1
        count -= (mid + 1)
      } else
        count = mid
    }

    this.queue.splice(index, 0, value)
  }

  dequeue () {
    return this.queue.pop()
  }

  add (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      const onResolved: QueueJob['resolve'] = (response) => {
        resolve(response)
        onDone()
      }

      const onRejected: QueueJob['reject'] = (error) => {
        reject(error)
        onDone()
      }

      const onAborted = () => {
        onRejected(new Axios.Cancel())
      }

      const onDone = () => {
        if (config.signal)
          config.signal.removeEventListener('abort', onAborted)
      }

      if (config.signal)
        config.signal.addEventListener('abort', onAborted)

      if (config.signal?.aborted !== true) {
        const queue: QueueJob = {
          resolve : onResolved,
          reject  : onRejected,
          config  : config,
          priority: config.priority ?? 1,
        }

        this.enqueue(queue)
        this.run()
      }
    })
  }

  run () {
    if (this.queue.length > 0 && this.process < this.options.worker) {
      this.process++

      const job    = this.dequeue()!
      const signal = job.config.signal

      if (signal?.aborted !== true) {
        this.fetch(job.config)
          .then(job.resolve)
          .catch(job.reject)
          .finally(() => {
            this.process--
            this.run()
          })
      }
    }
  }

  adapter (): AxiosAdapter {
    return async (config) => {
      return this.add(config)
    }
  }
}
