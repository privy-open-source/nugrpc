import { createRule, Validator } from ".."
import { isString } from "../utils"
import { createRegexpRule } from "./match"

export function isAlphaNumeric (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric', /^[a-zA-Z0-9]+$/)
}

export function isAlphaNumericSpace (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric_space', /^[a-zA-Z0-9\s]+$/)
}

export function isAlphaNumericSpaceAndSpecialCharacter (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric_space_special_character', /^[a-zA-Z0-9_+\s]+$/)
}

export function isJson(): Validator {
  return createRule('validation.error.must_be_json', (value) => {
    if (!isString(value))
      return false

    try {
      JSON.parse(value)
    } catch {
      return false
    }

    return true
  })
}
