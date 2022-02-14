import { createRule, Validator } from ".."

function isString (value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function length (length: number): Validator {
  return createRule('validation.error.must_be_length_between', (value) => {
    if (isString(value))
      return value.trim().length === length

    if (Array.isArray(value))
      return value.length === length

    return false
  })
}

export function minLength (length: number): Validator {
  return createRule('validation.error.must_be_no_less_than_length', (value) => {
    if (isString(value))
      return value.trim().length >= length

    if (Array.isArray(value))
      return value.length >= length

    return false
  })
}

export function maxLength (length: number): Validator {
  return createRule('validation.error.must_be_no_more_than_length', (value) => {
    if (isString(value))
      return value.trim().length <= length

    if (Array.isArray(value))
      return value.length <= length

    return false
  })
}
