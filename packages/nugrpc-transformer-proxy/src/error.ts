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

export function getDecoder(type: string): Decoder | null {
  switch (type) {
    case 'type.googleapis.com/google.rpc.BadRequest':
      return google.rpc.BadRequest

    case 'type.googleapis.com/google.rpc.ErrorInfo':
      return google.rpc.ErrorInfo

    case 'type.googleapis.com/google.rpc.RetryInfo':
      return google.rpc.RetryInfo

    case 'type.googleapis.com/google.rpc.DebugInfo':
      return google.rpc.DebugInfo

    case 'type.googleapis.com/google.rpc.QuotaFailure':
      return google.rpc.QuotaFailure

    case 'type.googleapis.com/google.rpc.PreconditionFailure':
      return google.rpc.PreconditionFailure

    case 'type.googleapis.com/google.rpc.RequestInfo':
      return google.rpc.RequestInfo

    case 'type.googleapis.com/google.rpc.ResourceInfo':
      return google.rpc.ResourceInfo

    case 'type.googleapis.com/google.rpc.Help':
      return google.rpc.Help

    case 'type.googleapis.com/google.rpc.LocalizedMessage':
      return google.rpc.LocalizedMessage

  }

  return null
}

export function getCode(code: number): number {
  switch (code) {
    case google.rpc.Code.INVALID_ARGUMENT:
      return 422

    case google.rpc.Code.FAILED_PRECONDITION:
    case google.rpc.Code.OUT_OF_RANGE:
      return 400

    case google.rpc.Code.UNAUTHENTICATED:
      return 401

    case google.rpc.Code.PERMISSION_DENIED:
      return 403

    case google.rpc.Code.NOT_FOUND:
      return 404

    case google.rpc.Code.ABORTED:
    case google.rpc.Code.ALREADY_EXISTS:
      return 409

    case google.rpc.Code.RESOURCE_EXHAUSTED:
      return 429

    case google.rpc.Code.CANCELLED:
      return 499

    case google.rpc.Code.DATA_LOSS:
    case google.rpc.Code.UNKNOWN:
    case google.rpc.Code.INTERNAL:
      return 500

    case google.rpc.Code.UNIMPLEMENTED:
      return 501

    case google.rpc.Code.UNAVAILABLE:
      return 503

    case google.rpc.Code.DEADLINE_EXCEEDED:
      return 504

    default:
      return 500
  }
}

export function isServiceError(error: any): error is ServiceError {
  return error.code
    && error.details
    && error.metadata
    && error.metadata instanceof Metadata
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
