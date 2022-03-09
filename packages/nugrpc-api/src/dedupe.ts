import type { AxiosAdapter } from "axios"

let limit: Map<string, AbortController> = new Map()

export function cancelAll() {
  for (const controller of limit.values())
    controller.abort()
}

export function cancel (requestId: string) {
  const controller = limit.get(requestId)

  if (controller)
    controller.abort()
}

export const DedupeAdapter = (adapter: AxiosAdapter): AxiosAdapter => {
  return (config) => {
    const requestId = config.requestId

    if (!requestId)
      return adapter(config)

    cancel(requestId)

    const controller = new AbortController()
    const signal     = controller.signal

    limit.set(requestId, controller)

    if (config.signal) {
      config.signal.addEventListener('abort', () => {
        controller.abort()
      }, { once: true })
    }

    return new Promise((resolve, reject) => {
      adapter({ ...config, signal })
        .then(resolve)
        .catch(reject)
        .finally(() => {
          limit.delete(requestId)
        })
    })
  }
}
