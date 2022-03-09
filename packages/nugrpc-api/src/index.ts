import Axios from 'axios'
import type {
  AxiosError,
  AxiosResponse,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'
import { QueueAdapter } from './queue'
import { cancelAll, DedupeAdapter } from './dedupe'

declare module 'axios' {
  interface AxiosRequestConfig {
    priority?: number;
    requestId?: string;
  }
}

export interface Error {
  type_url: string;
  value: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details: Error[];
}

export type { AxiosRequestConfig }

export type ApiError = AxiosError<ErrorResponse>

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export type RequestHook = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig> | void

export type ResponseHook = (config: AxiosResponse) => AxiosResponse | Promise<AxiosResponse> | void

export type ErrorHook = (error: Error | AxiosError) => Error | AxiosError | void

export const isAxiosError = Axios.isAxiosError

export const isCancel = Axios.isCancel

export interface AxiosHooks {
  onRequest: RequestHook[];
  onResponse: ResponseHook[];
  onErrorRequest: ErrorHook[];
  onErrorResponse: ErrorHook[];
}
export interface AxiosExtended extends AxiosInstance {
  hooks: AxiosHooks;
  extend (this: AxiosExtended, newOptions?: AxiosRequestConfig): AxiosExtended;
  cancelAll: typeof cancelAll;
}


export function isApiError (error: unknown): error is ApiError {
  return isAxiosError(error)
    && Boolean(error.response)
    && Array.isArray(error.response?.data.details)
}

export function getCode (error: unknown): number {
  if (isAxiosError(error))
    return error.response?.status ?? 500

  return 500
}

export function getMessage (error: unknown): string {
  if (isAxiosError(error))
    return error.response?.data.message

  return error instanceof Error
    ? error.message
    : 'Unknown Error'
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

export function onRequest (fn: RequestHook, instance = useAxios()): void {
  instance.hooks.onRequest.push(fn)
  instance.interceptors.request.use((config) => fn(config) ?? config)
}

export function onResponse (fn: ResponseHook, instance = useAxios()) {
  instance.hooks.onResponse.push(fn)
  instance.interceptors.response.use((response) => fn(response) ?? response)
}

export function onErrorRequest (fn: ErrorHook, instance = useAxios()) {
  instance.hooks.onErrorRequest.push(fn)
  instance.interceptors.request.use(undefined, (error) => fn(error) ?? Promise.reject(error))
}

export function onErrorResponse (fn: ErrorHook, instance = useAxios()) {
  instance.hooks.onErrorResponse.push(fn)
  instance.interceptors.response.use(undefined, (error) => fn(error) ?? Promise.reject(error))
}

export function onError (fn: ErrorHook, instance = useAxios()) {
  onErrorRequest(fn, instance)
  onErrorResponse(fn, instance)
}

export function extendAxios(options?: AxiosRequestConfig, oldInstance = useAxios()): AxiosExtended {
  // @ts-expect-error
  const instance = oldInstance.create(options)

  for (const hook of oldInstance.hooks.onRequest)
    onRequest(hook, instance)

  for (const hook of oldInstance.hooks.onResponse)
    onResponse(hook, instance)

  for (const hook of oldInstance.hooks.onErrorRequest)
    onErrorRequest(hook, instance)

  for (const hook of oldInstance.hooks.onErrorResponse)
    onErrorResponse(hook, instance)

  return instance
}

export function createAxios (options?: AxiosRequestConfig): AxiosExtended {
  const adapter  = DedupeAdapter(QueueAdapter(options?.adapter ?? Axios.defaults.adapter!))
  const instance = Axios.create({
    adapter,
    ...options,
  })

  const hooks: AxiosHooks = {
    onRequest      : [],
    onResponse     : [],
    onErrorRequest : [],
    onErrorResponse: [],
  }

  return Object.assign(instance, {
    cancelAll: cancelAll,
    hooks    : hooks,
    extend   : function (this: AxiosExtended, newOptions?: AxiosRequestConfig) {
      return extendAxios(newOptions, this)
    }
  })
}
