import Axios, { AxiosCreateConfig, AxiosInstance } from 'axios'
import defu from 'defu'
import type {
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import DedupeAdapter from './dedupe'
import QueueAdapter from './queue'

declare module 'axios' {
  export interface AxiosCreateConfig extends Omit<AxiosRequestConfig, 'headers'> {
    headers?: AxiosRequestHeaders | Partial<{
      delete: AxiosRequestHeaders,
      get: AxiosRequestHeaders,
      head: AxiosRequestHeaders,
      post: AxiosRequestHeaders,
      put: AxiosRequestHeaders,
      patch: AxiosRequestHeaders,
    }>;
  }

  export interface AxiosRequestConfig {
    priority?: number;
    requestId?: string;
  }

  export interface AxiosStatic extends AxiosInstance {
    create (config?: AxiosCreateConfig): AxiosInstance;
  }
}

export type { AxiosRequestConfig }

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export type RequestHook = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig> | void

export type ResponseHook = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse> | void

export type ErrorHook = (error: any) => any

export type Hook = RequestHook | ResponseHook | ErrorHook

export type Hooks = {
  onRequest: RequestHook;
  onResponse: ResponseHook;
  onRequestError: ErrorHook;
  onResponseError: ErrorHook;
}

export type HooksMap = {
  [K in keyof Hooks]: Map<number, Hooks[K]>
}
export interface AxiosExtended extends AxiosInstance {
  hooks: HooksMap;
  cancel: InstanceType<typeof DedupeAdapter>['cancel'];
  cancelAll: InstanceType<typeof DedupeAdapter>['cancelAll'];
  dedupe: DedupeAdapter;
  queue: QueueAdapter;
  create (this: AxiosExtended, config?: AxiosCreateConfig): AxiosExtended,
}


let singleton: AxiosExtended

export function useAxios (): AxiosExtended {
  if (!singleton)
    singleton = createAxios()

  return singleton
}

export function setAxios (instance: AxiosExtended) {
  singleton = instance
}

export function createAxios (options?: AxiosCreateConfig): AxiosExtended {
  const originalAdapter = options?.adapter ?? Axios.defaults.adapter!
  const queue           = new QueueAdapter(originalAdapter)
  const dedupe          = new DedupeAdapter(queue.adapter())
  const adapter         = dedupe.adapter()
  const instance        = Axios.create({
    ...options,
    adapter,
  })

  const hooks: HooksMap = {
    onRequest      : new Map(),
    onResponse     : new Map(),
    onRequestError : new Map(),
    onResponseError: new Map(),
  }

  return Object.assign(instance, {
    cancel   : dedupe.cancel.bind(dedupe),
    cancelAll: dedupe.cancelAll.bind(dedupe),
    queue    : queue,
    dedupe   : dedupe,
    hooks    : hooks,
    create   : function (this: AxiosExtended, newOptions: AxiosCreateConfig = {}): AxiosExtended {
      const instance = createAxios(defu(
        newOptions,
        { adapter: originalAdapter },
        this.defaults as AxiosCreateConfig,
      ))

      return copyHook(this, instance)
    }
  })
}

export function onRequest (fn: RequestHook, instance = useAxios()) {
  return addHook('onRequest', fn, instance)
}

export function onResponse (fn: ResponseHook, instance = useAxios()) {
  return addHook('onResponse', fn, instance)
}

export function onRequestError (fn: ErrorHook, instance = useAxios()) {
  return addHook('onRequestError', fn, instance)
}

export function onResponseError (fn: ErrorHook, instance = useAxios()) {
  return addHook('onResponseError', fn, instance)
}

export function onError (fn: ErrorHook, instance = useAxios()) {
  const a = onRequestError(fn, instance)
  const b = onResponseError(fn, instance)

  return [a, b]
}

export function addHook<K extends keyof Hooks> (name: K, fn: Hooks[K], instance = useAxios()): number | undefined {
  let id: number | undefined

  if (name === 'onRequest')
    id = instance.interceptors.request.use((config) => fn(config) ?? Promise.resolve(config))

  else if (name === 'onRequestError')
    id = instance.interceptors.request.use(undefined, (error) => fn(error) ?? Promise.reject(error))

  else if (name === 'onResponse')
    id = instance.interceptors.response.use((response) => fn(response) ?? Promise.resolve(response))

  else if (name === 'onResponseError')
    id = instance.interceptors.response.use(undefined, (error) => fn(error) ?? Promise.reject(error))

  if (id !== undefined)
    instance.hooks[name].set(id, fn)

  return id
}

export function removeHook<K extends keyof HooksMap> (name: K, id: number, instance = useAxios()): void {
  if (name === 'onRequest' || name === 'onRequestError')
    instance.interceptors.request.eject(id)

  else if (name === 'onResponse' || name === 'onResponseError')
    instance.interceptors.response.eject(id)

  instance.hooks[name].delete(id)
}

export function resetHook (instance = useAxios()) {
  const hooks = Object.keys(instance.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const id of instance.hooks[name].keys()) {
      removeHook(name, id, instance)
    }
  }
}

export function copyHook (from: AxiosExtended, to: AxiosExtended): AxiosExtended {
  const hooks = Object.keys(from.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const fn of from.hooks[name].values())
      addHook(name, fn, to)
  }

  return to
}
