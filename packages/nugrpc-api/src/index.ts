import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import Axios, { AxiosInstance, AxiosRequestHeaders, AxiosStatic } from 'axios'
import defu from 'defu'
import type {
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import DedupeAdapter from './dedupe'
import QueueAdapter, { QueueOptions } from './queue'

declare module 'axios' {
  export interface AxiosRequestConfig {
    priority?: number;
    requestId?: string;
  }

  export interface AxiosStatic extends AxiosInstance {
    create (config?: ApiConfig): AxiosInstance;
  }
}
export interface ApiConfig extends Omit<AxiosRequestConfig, 'headers'> {
  headers?: AxiosRequestHeaders & Partial<{
    common: AxiosRequestHeaders;
    delete: AxiosRequestHeaders;
    get: AxiosRequestHeaders;
    head: AxiosRequestHeaders;
    post: AxiosRequestHeaders;
    put: AxiosRequestHeaders;
    patch: AxiosRequestHeaders;
  }>;
  queue?: QueueOptions;
}

type onFulfilledOf<T> = T extends (onFulfilled: infer R) => number ? NonNullable<R> : never

type onRejectedOf<T> = T extends (onFulfilled: undefined, onRejected: infer R) => number ? NonNullable<R> : never

export type { AxiosRequestConfig }

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export type RequestHook = onFulfilledOf<AxiosStatic['interceptors']['request']['use']>

export type ResponseHook = onFulfilledOf<AxiosStatic['interceptors']['response']['use']>

export type ErrorHook = onRejectedOf<AxiosStatic['interceptors']['response']['use']>

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
export interface ApiInstance extends AxiosInstance {
  hooks: HooksMap;
  cancel: InstanceType<typeof DedupeAdapter>['cancel'];
  cancelAll: InstanceType<typeof DedupeAdapter>['cancelAll'];
  dedupe: DedupeAdapter;
  queue: QueueAdapter;
  create (this: ApiInstance, config?: ApiConfig): ApiInstance,
}

let api: ApiInstance

export function useApi (): ApiInstance {
  if (!api)
    api = createApi()

  return api
}

export function setApi (instance: ApiInstance) {
  api = instance
}

export function createApi (options: ApiConfig = {}): ApiInstance {
  const originalAdapter = options.adapter ?? Axios.defaults.adapter!
  const queue           = new QueueAdapter(originalAdapter, options.queue)
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
    create   : function (this: ApiInstance, newOptions: ApiConfig = {}): ApiInstance {
      const instance = createApi(defu(
        newOptions,
        { adapter: originalAdapter },
        options,
      ))

      return copyHook(this, instance)
    }
  })
}

export function onRequest (fn: RequestHook, instance = useApi()) {
  return addHook('onRequest', fn, instance)
}

export function onResponse (fn: ResponseHook, instance = useApi()) {
  return addHook('onResponse', fn, instance)
}

export function onRequestError (fn: ErrorHook, instance = useApi()) {
  return addHook('onRequestError', fn, instance)
}

export function onResponseError (fn: ErrorHook, instance = useApi()) {
  return addHook('onResponseError', fn, instance)
}

export function onError (fn: ErrorHook, instance = useApi()) {
  const a = onRequestError(fn, instance)
  const b = onResponseError(fn, instance)

  return [a, b]
}

export function addHook<K extends keyof Hooks> (name: K, fn: Hooks[K], instance = useApi()): number | undefined {
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

export function removeHook<K extends keyof HooksMap> (name: K, id: number, instance = useApi()): void {
  if (name === 'onRequest' || name === 'onRequestError')
    instance.interceptors.request.eject(id)

  else if (name === 'onResponse' || name === 'onResponseError')
    instance.interceptors.response.eject(id)

  instance.hooks[name].delete(id)
}

export function resetHook (instance = useApi()) {
  const hooks = Object.keys(instance.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const id of instance.hooks[name].keys()) {
      removeHook(name, id, instance)
    }
  }
}

export function copyHook (from: ApiInstance, to: ApiInstance): ApiInstance {
  const hooks = Object.keys(from.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const fn of from.hooks[name].values())
      addHook(name, fn, to)
  }

  return to
}

export * from "./error"
