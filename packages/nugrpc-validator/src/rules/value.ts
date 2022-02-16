import { createRule, Validator } from ".."
import { isNumber, isString } from "../utils"

export function minValue (number: number): Validator {
  return createRule('validation.error.must_be_no_less_than_value', (value) => {
    if (!isNumber(value) && !isString(value))
      return false

    const numValue = Number.parseFloat(`${value}`)

    return Number.isFinite(numValue) && numValue >= number
  })
}

export function maxValue (number: number): Validator {
  return createRule('validation.error.must_be_no_less_than_value', (value) => {
    if (!isNumber(value) && !isString(value))
      return false

    const numValue = Number.parseFloat(`${value}`)

    return Number.isFinite(numValue) && numValue <= number
  })
}
