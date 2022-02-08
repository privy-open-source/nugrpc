import axios from 'axios'
import { ApiError } from '../core/api'

export function isApiError (error: any): error is ApiError {
  return axios.isAxiosError(error)
    && Boolean(error.response)
    && Array.isArray(error.response?.data.details)
}

export function getCode (error: any): number {
  if (axios.isAxiosError(error))
    return error.response?.status ?? 500

  return 500
}

export function getMessage (error: any): string {
  if (axios.isAxiosError(error))
    return error.response?.data.message

  return error instanceof Error
    ? error.message
    : 'Unknown Error'
}
