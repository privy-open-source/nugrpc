import { Metadata } from "@grpc/grpc-js"
import { callErrorFromStatus } from "@grpc/grpc-js/build/src/call"
import { Status } from "@grpc/grpc-js/build/src/constants"
import { google } from "@privyid/google-rpc"
import { formatError, getCode, getDecoder, isServiceError } from "./error"

describe('getCode', () => {
  const cases: Array<[string, number, number]> = [
    ['INVALID_ARGUMENT',    google.rpc.Code.INVALID_ARGUMENT,     422],
    ['FAILED_PRECONDITION', google.rpc.Code.FAILED_PRECONDITION,  400],
    ['OUT_OF_RANGE',        google.rpc.Code.OUT_OF_RANGE,         400],
    ['UNAUTHENTICATED',     google.rpc.Code.UNAUTHENTICATED,      401],
    ['PERMISSION_DENIED',   google.rpc.Code.PERMISSION_DENIED,    403],
    ['NOT_FOUND',           google.rpc.Code.NOT_FOUND,            404],
    ['ABORTED',             google.rpc.Code.ABORTED,              409],
    ['ALREADY_EXISTS',      google.rpc.Code.ALREADY_EXISTS,       409],
    ['RESOURCE_EXHAUSTED',  google.rpc.Code.RESOURCE_EXHAUSTED,   429],
    ['CANCELLED',           google.rpc.Code.CANCELLED,            499],
    ['DATA_LOSS',           google.rpc.Code.DATA_LOSS,            500],
    ['UNKNOWN',             google.rpc.Code.UNKNOWN,              500],
    ['INTERNAL',            google.rpc.Code.INTERNAL,             500],
    ['UNIMPLEMENTED',       google.rpc.Code.UNIMPLEMENTED,        501],
    ['UNAVAILABLE',         google.rpc.Code.UNAVAILABLE,          503],
    ['DEADLINE_EXCEEDED',   google.rpc.Code.DEADLINE_EXCEEDED,    504],
    ['other error',         99999,                                500],
  ]

  it.each(cases)('Error GRPC "%s" (%s) should be converted to HTTP Code %s', (_, grpcCode, httpCode) => {
    expect(getCode(grpcCode)).toBe(httpCode)
  })
})

describe('getDecoder', () => {
  function isClass (func: any): boolean {
    return typeof func === 'function'
      && /^class\s/.test(Function.prototype.toString.call(func));
  }

  const cases: Array<[string, any]> = [
    ['type.googleapis.com/google.rpc.BadRequest',           google.rpc.BadRequest],
    ['type.googleapis.com/google.rpc.ErrorInfo',            google.rpc.ErrorInfo],
    ['type.googleapis.com/google.rpc.RetryInfo',            google.rpc.RetryInfo],
    ['type.googleapis.com/google.rpc.DebugInfo',            google.rpc.DebugInfo],
    ['type.googleapis.com/google.rpc.QuotaFailure',         google.rpc.QuotaFailure],
    ['type.googleapis.com/google.rpc.PreconditionFailure',  google.rpc.PreconditionFailure],
    ['type.googleapis.com/google.rpc.RequestInfo',          google.rpc.RequestInfo],
    ['type.googleapis.com/google.rpc.ResourceInfo',         google.rpc.ResourceInfo],
    ['type.googleapis.com/google.rpc.Help',                 google.rpc.Help],
    ['type.googleapis.com/google.rpc.LocalizedMessage',     google.rpc.LocalizedMessage],
    ['type.googleapis.com/google.rpc.Unregitered',          null],
  ]

  it.each(cases)('(%s) should be return a decoder %s', (name, result) => {
    const decoder = getDecoder(name)

    expect(Object.is(decoder, result)).toBe(true)
    expect(isClass(decoder)).toBe(isClass(result))
  })
})

describe('isServiceError', () => {
  it('should return false if it a normal error', () => {
    const error  = new Error('Normal Error')
    const result = isServiceError(error)

    expect(result).toBe(false)
  })

  it('should return true if error result', () => {
    const metadata = new Metadata()
    const error    = callErrorFromStatus({
      code    : Status.INVALID_ARGUMENT,
      details : 'INVALID_ARGUMENT',
      metadata: metadata,
    })

    expect(isServiceError(error)).toBe(true)
  })
})

describe('formatError', () => {
  it('should return error code 500 and their message if it is normal error', () => {
    const result   = formatError(new Error('This is error message'))
    const expected = {
      code   : 500,
      message: 'This is error message',
      details: [],
    }

    expect(result).toStrictEqual(expected)
  })

  it('should return error grpc code (in HTTP code equivalent) and their message if it is service error with no metadata details', () => {
    const metadata = new Metadata()
    const code     = getCode(Status.INVALID_ARGUMENT)
    const error    = callErrorFromStatus({
      code    : Status.INVALID_ARGUMENT,
      details : 'INVALID_ARGUMENT',
      metadata: metadata,
    })

    const result   = formatError(error)
    const expected = {
      code   : code,
      message: 'INVALID_ARGUMENT',
      details: [],
    }

    expect(result).toStrictEqual(expected)
  })

  it('should return error grpc code (in HTTP code equivalent) and their message if it is service error with no metadata details', () => {
    const badRequest = google.rpc.BadRequest.encode({
      field_violations: [
        {
          field      : 'user',
          description: 'is required',
        }
      ]
    })

    const any = google.protobuf.Any.fromObject({
      type_url: 'type.googleapis.com/google.rpc.BadRequest',
      value   : badRequest.finish()
    })

    const status = google.rpc.Status.encode({
      code   : Status.INVALID_ARGUMENT,
      message: 'INVALID_ARGUMENT',
      details: [any],
    })

    const metadata = new Metadata()

    metadata.add('grpc-status-details-bin', Buffer.from(status.finish()))

    const code  = getCode(Status.INVALID_ARGUMENT)
    const error = callErrorFromStatus({
      code    : Status.INVALID_ARGUMENT,
      details : 'INVALID_ARGUMENT',
      metadata: metadata,
    })

    const result   = formatError(error)
    const expected = {
      code   : code,
      message: 'INVALID_ARGUMENT',
      details: [
        {
          type_url        : any.type_url,
          value           : Buffer.from(any.value).toString('base64'),
          field_violations: [
            {
              field      : 'user',
              description: 'is required',
            }
          ]
        }
      ],
    }

    expect(result).toStrictEqual(expected)
  })
})
