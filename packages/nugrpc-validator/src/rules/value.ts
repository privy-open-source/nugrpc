import { createRule, Validator } from "../rule"
import { isDate, isNumber, isString } from "../utils"

export function minValue (min: number | Date): Validator {
  return createRule('validation.error.must_be_no_less_than_value', (value) => {
    if (isDate(min))
      return isDate(value) && value >= min

    if (isNumber(value))
      return Number.isFinite(value) && value >= min

    if (isString(value)) {
      const numValue = Number.parseFloat(value)

      return Number.isFinite(numValue) && numValue >= min
    }

    return false
  })
}

export function maxValue (max: number | Date): Validator {
  return createRule('validation.error.must_be_no_less_than_value', (value) => {
    if (isDate(max))
      return isDate(value) && value <= max

    if (isNumber(value))
      return Number.isFinite(value) && value <= max

    if (isString(value)) {
      const numValue = Number.parseFloat(value)

      return Number.isFinite(numValue) && numValue <= max
    }

    return false
  })
}
