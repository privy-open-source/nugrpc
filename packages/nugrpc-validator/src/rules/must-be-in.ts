import { createRule, Validator } from "../rule"
import { isNumber, isString } from "../utils"

export function mustBeIn (...inValues: Array<string | number | string[] | number[]>): Validator {
  return createRule('validation.error.must_be_in', (value) => {
    if (isString(value) || isNumber(value))
      return inValues.flat().includes(value)

    return false
  })
}

export default mustBeIn
