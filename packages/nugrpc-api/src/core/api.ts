import { AxiosError, AxiosResponse } from 'axios'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface Error {
  type_url: string;
  value: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details: Error[];
}

export type ApiError = AxiosError<ErrorResponse>

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export let $axios: NuxtAxiosInstance

export function initializeAxios (axiosInstance: NuxtAxiosInstance): void {
  $axios = axiosInstance
}
