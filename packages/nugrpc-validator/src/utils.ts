export function isNumber (value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isNotNumber(value: unknown): boolean {
  return Number.isNaN(value)
}

export function isString (value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

export function isDate (value: unknown): value is Date {
  return value instanceof Date
}

export function isObject (value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && value.constructor === Object
}

export function isNull (value: unknown): value is null {
  return value === null
}

export function isUndefined (value: unknown): value is undefined {
  return typeof value === 'undefined'
}

export function isArray (value: unknown): value is Array<unknown> {
  return Array.isArray(value)
}

export function isEmptyArray (value: unknown): value is [] {
  return isArray(value) && value.length === 0
}

export function isEmptyString (value: unknown): value is '' {
  return isString(value) && value.trim().length === 0
}

export function get<T, K extends string & keyof T>(values: T, key: K): T[K] | undefined {
  return isObject(values) ? values[key] : undefined
}
