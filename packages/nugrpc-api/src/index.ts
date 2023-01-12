import Axios, { AxiosInstance, AxiosPromise, AxiosRequestHeaders, AxiosStatic } from 'axios'
import defu from 'defu'
import type {
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios'
import DedupeAdapter from './dedupe'
import QueueAdapter, { QueueOptions } from './queue'
import { joinURL } from 'ufo'

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
  prefixURL?: string;
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

export interface LazyInstance {
  (): ApiInstance,
  setApi (instance: ApiInstance): void,
}

/**
 * Create new lazy-singleton instance
 * @param options Axios create options
 * @param fresh Create fresh instance instead of cloning global instance
 * @example
 *  const useApi = createLazyton({ prefixURL: '/api/anu' })
 *
 *  useApi().get('/url/endpoint/')
 */
export function createLazyton (options: ApiConfig = {}, fresh = false): LazyInstance {
  let api: ApiInstance

  const getApi = function () {
    if (!api) {
      api = fresh
        ? createApi(options)
        : useApi().create(options)
    }

    return api
  }

  const setApi = function (instance: ApiInstance) {
    api = instance
  }

  return Object.assign(getApi, { setApi })
}

/**
 * Use global api instance
 * @example
 * let api = useApi()
 *
 * api.get('/some/endpoint')
 */
export const useApi = createLazyton({}, true)

/**
 * Set global api instance
 * @param instance
 */
export const setApi = useApi.setApi

/**
 * Create new api instance
 * @param options
 */
export function createApi (options: ApiConfig = {}): ApiInstance {
  const baseURL = (options.prefixURL && options.baseURL)
    ? joinURL(options.baseURL, options.prefixURL)
    : options.baseURL

  const originalAdapter = options.adapter ?? Axios.defaults.adapter!
  const queue           = new QueueAdapter(originalAdapter, options.queue)
  const dedupe          = new DedupeAdapter(queue.adapter())
  const adapter         = dedupe.adapter()
  const instance        = Axios.create({
    ...options,
    baseURL,
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

/**
 * Add global on-request handler
 * @param fn handler
 */
export function onRequest (fn: RequestHook): number
/**
 * Add on-request handler to instance
 * @param fn handler
 * @param instance target instance
 */
export function onRequest (fn: RequestHook, instance: ApiInstance): number
export function onRequest (fn: RequestHook, instance = useApi()) {
  return addHook('onRequest', fn, instance)
}

/**
 * Add global on-response handler
 * @param fn handler
 */
export function onResponse (fn: ResponseHook): number
/**
 * Add on-response handler to instance
 * @param fn handler
 * @param instance target instance
 */
export function onResponse (fn: ResponseHook, instance: ApiInstance): number
export function onResponse (fn: ResponseHook, instance = useApi()) {
  return addHook('onResponse', fn, instance)
}

/**
 * Add global on-request-error
 * @param fn handler
 */
export function onRequestError (fn: ErrorHook): number
/**
 * Add on-request-error to instance
 * @param fn handler
 * @param instance instance
 */
export function onRequestError (fn: ErrorHook, instance: ApiInstance): number
export function onRequestError (fn: ErrorHook, instance = useApi()) {
  return addHook('onRequestError', fn, instance)
}

/**
 * Add global on-response-error handler.
 * @param fn
 * @param instance
 */
export function onResponseError (fn: ErrorHook): number
/**
 * Add on-response-error handler to instance.
 * @param fn handler
 * @param instance target instance
 */
export function onResponseError (fn: ErrorHook, instance: ApiInstance): number
export function onResponseError (fn: ErrorHook, instance = useApi()) {
  return addHook('onResponseError', fn, instance)
}

/**
 * Add global onError handler, onError is equal to onRequestError + onResponseError
 * @param fn handler
 */
export function onError (fn: ErrorHook): [number, number]
/**
 * Add onError handler to instance, onError is equal to onRequestError + onResponseError
 * @param fn handler
 * @param instance target instance
 */
export function onError (fn: ErrorHook, instance: ApiInstance): [number, number]
export function onError (fn: ErrorHook, instance = useApi()) {
  const a = onRequestError(fn, instance)
  const b = onResponseError(fn, instance)

  return [a, b]
}

/**
 * Add hook to global instance
 * @param name event name
 * @param fn handler
 */
export function addHook<K extends keyof Hooks> (name: K, fn: Hooks[K]): number | undefined
/**
 * Add hook to instance
 * @param name event name
 * @param fn handler
 * @param instance target instance
 */
export function addHook<K extends keyof Hooks> (name: K, fn: Hooks[K], instance: ApiInstance): number | undefined
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

/**
 * Remove hook from global instance
 * @param name hook name
 * @param id hook id
 */
export function removeHook<K extends keyof HooksMap> (name: K, id: number): void
/**
 * Remove hook from instance
 * @param name hook name
 * @param id hook id
 */
export function removeHook<K extends keyof HooksMap> (name: K, id: number, instance: ApiInstance): void
export function removeHook<K extends keyof HooksMap> (name: K, id: number, instance = useApi()): void {
  if (name === 'onRequest' || name === 'onRequestError')
    instance.interceptors.request.eject(id)

  else if (name === 'onResponse' || name === 'onResponseError')
    instance.interceptors.response.eject(id)

  instance.hooks[name].delete(id)
}

/**
 * Reset all global hooks
 * @param instance
 */
export function resetHook (): void
/**
 * Reset all hook from instance
 * @param instance target instance
 */
export function resetHook (instance: ApiInstance): void
export function resetHook (instance = useApi()) {
  const hooks = Object.keys(instance.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const id of instance.hooks[name].keys()) {
      removeHook(name, id, instance)
    }
  }
}

/**
 * Copy hook from instance to instance
 * @param from Source instance
 * @param to Target instance
 */
export function copyHook (from: ApiInstance, to: ApiInstance): ApiInstance {
  const hooks = Object.keys(from.hooks) as Array<keyof HooksMap>

  for (const name of hooks) {
    for (const fn of from.hooks[name].values())
      addHook(name, fn, to)
  }

  return to
}

export * from "./error"
