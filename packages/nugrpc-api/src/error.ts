import Axios, { AxiosError } from "axios"

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

export const isAxiosError = Axios.isAxiosError

export const isCancel = Axios.isCancel

/**
 * Check error is an ApiError
 * @param error
 */
export function isApiError (error: unknown): error is ApiError {
  return isAxiosError(error)
    && Array.isArray(error.response?.data?.details)
}

/**
 * Get error code
 * @param error
 */
export function getCode (error: unknown): number {
  if (isAxiosError(error))
    return error.response?.status ?? 500

  return 500
}

/**
 * Get error message
 * @param error
 */
export function getMessage (error: unknown): string {
  if (isAxiosError(error) && error.response?.data.message)
    return error.response.data.message

  return error instanceof Error
    ? error.message
    : 'Unknown Error'
}
