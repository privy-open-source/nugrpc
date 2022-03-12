import type PQueue from 'p-queue'
import type { AxiosAdapter } from 'axios'

type PQueueOptions = NonNullable<ConstructorParameters<typeof PQueue>[0]>

export default class QueueAdapter {
  protected fetch: AxiosAdapter;
  protected queue?: PQueue;
  protected options?: PQueueOptions;

  constructor (adapter: AxiosAdapter, options: PQueueOptions = { concurrency: 5 }) {
    this.fetch   = adapter
    this.options = options
  }

  async getQueue () {
    if (!this.queue) {
      const PQueue = (await import('p-queue')).default

      this.queue = new PQueue(this.options)
    }

    return this.queue
  }

  adapter (): AxiosAdapter {
    return async (config) => {
      const queue = await this.getQueue()

      return queue.add(() => this.fetch(config), {
        priority: config.priority,
        signal  : config.signal,
      })
    }
  }
}
