import { google } from '@privyid/google-rpc'
import { Metadata, ServiceError } from '@grpc/grpc-js'

export type DecodeResult = {
  toJSON(): Record<string, any>
}

export type Decoder = {
  decode: (buffer: Buffer | Uint8Array) => DecodeResult;
}

export type ErrorDetail = google.protobuf.IAny & Record<string, any>

export type ErrorResponse = {
  code: number;
  message: string;
  details?: (ErrorDetail | undefined)[];
}

const DECODER_MAP: Record<string, Decoder> = {
  'type.googleapis.com/google.rpc.BadRequest'         : google.rpc.BadRequest,
  'type.googleapis.com/google.rpc.ErrorInfo'          : google.rpc.ErrorInfo,
  'type.googleapis.com/google.rpc.RetryInfo'          : google.rpc.RetryInfo,
  'type.googleapis.com/google.rpc.DebugInfo'          : google.rpc.DebugInfo,
  'type.googleapis.com/google.rpc.QuotaFailure'       : google.rpc.QuotaFailure,
  'type.googleapis.com/google.rpc.PreconditionFailure': google.rpc.PreconditionFailure,
  'type.googleapis.com/google.rpc.RequestInfo'        : google.rpc.RequestInfo,
  'type.googleapis.com/google.rpc.ResourceInfo'       : google.rpc.ResourceInfo,
  'type.googleapis.com/google.rpc.Help'               : google.rpc.Help,
  'type.googleapis.com/google.rpc.LocalizedMessage'   : google.rpc.LocalizedMessage,
}

const ERROR_CODE_MAP: Record<number, number> = {
  [google.rpc.Code.INVALID_ARGUMENT]   : 422,
  [google.rpc.Code.FAILED_PRECONDITION]: 400,
  [google.rpc.Code.OUT_OF_RANGE]       : 400,
  [google.rpc.Code.UNAUTHENTICATED]    : 401,
  [google.rpc.Code.PERMISSION_DENIED]  : 403,
  [google.rpc.Code.NOT_FOUND]          : 404,
  [google.rpc.Code.ABORTED]            : 409,
  [google.rpc.Code.ALREADY_EXISTS]     : 409,
  [google.rpc.Code.RESOURCE_EXHAUSTED] : 429,
  [google.rpc.Code.CANCELLED]          : 499,
  [google.rpc.Code.DATA_LOSS]          : 500,
  [google.rpc.Code.UNKNOWN]            : 500,
  [google.rpc.Code.INTERNAL]           : 500,
  [google.rpc.Code.UNIMPLEMENTED]      : 501,
  [google.rpc.Code.UNAVAILABLE]        : 503,
  [google.rpc.Code.DEADLINE_EXCEEDED]  : 504,
}

export function getDecoder(type: string): Decoder | undefined {
  return DECODER_MAP[type]
}

export function getCode(code: number): number {
  return ERROR_CODE_MAP[code] ?? 500
}

export function isServiceError(error: any): error is ServiceError {
  return Boolean(error.code
    && error.details
    && error.metadata
    && error.metadata instanceof Metadata)
}

export function formatError(error: any): ErrorResponse {
  if (isServiceError(error)) {
    const headers = error.metadata.getMap()
    const buffer  = headers['grpc-status-details-bin']

    if (Buffer.isBuffer(buffer)) {
      const status  = google.rpc.Status.decode(buffer)
      const details = status.details.map((any) => {
        const item    = new google.protobuf.Any(any)
        const decoder = getDecoder(item.type_url)
        const detail  = Buffer.isBuffer(item.value) && decoder
          ? decoder.decode(item.value)
          : undefined

        if (detail) {
          return {
            ...item.toJSON(),
            ...detail.toJSON(),
          }
        }

        return item.toJSON()
      })

      return {
        code   : getCode(status.code),
        message: status.message,
        details: details,
      }
    }

    return {
      code   : getCode(error.code),
      message: error.details,
      details: [],
    }
  }

  return {
    code   : error.code ?? 500,
    message: error.message,
    details: [],
  }
}
