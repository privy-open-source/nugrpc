import axios from 'axios'
import { ApiError } from '../core/api'

export function isApiError (error: any): error is ApiError {
  return axios.isAxiosError(error)
    && Array.isArray(error.response.data.details)
}

export function getCode (error: unknown): number {
  return axios.isAxiosError(error)
    ? error.response.status
    : 500
}

export function getMessage (error: unknown): string {
  if (axios.isAxiosError(error))
    return error.response.data.message

  return error instanceof Error
    ? error.message
    : 'Unknown Error'
}
