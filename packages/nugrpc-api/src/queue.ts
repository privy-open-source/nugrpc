import type PQueue from 'p-queue'
import type { AxiosAdapter } from 'axios'

let queue: PQueue

export async function useQueue() {
  if (!queue) {
    const { default: PQueue } = await import('p-queue')

    queue = new PQueue({ concurrency: 5 })
  }

  return queue
}

export const QueueAdapter = (adapter: AxiosAdapter): AxiosAdapter => {
  return async (config) => {
    const queue = await useQueue()

    return queue.add(() => adapter(config), {
      priority: config.priority,
      signal  : config.signal,
    })
  }
}
