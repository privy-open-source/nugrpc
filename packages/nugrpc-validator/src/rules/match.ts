import { Validator, createRule } from "../rule"
import { isString, isNumber } from "../utils"

export function createRegexpRule (name: string, regex: RegExp): Validator {
  return createRule(name, (value) => {
    return (isString(value) || isNumber(value))
      && regex.test(String(value).trim())
  })
}

export function match (regex: RegExp) {
  return createRegexpRule('validation.error.must_be_match', regex)
}

export default match
