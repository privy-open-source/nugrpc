import { createRule, Validator } from ".."
import { isNumber, isString } from "../utils"

export function mustBeIn (...inValues: Array<string | number>): Validator {
  return createRule('validation.error.must_be_in', (value) => {
    if (isString(value) || isNumber(value))
      return inValues.includes(value)

    return true
  })
}

export default mustBeIn
