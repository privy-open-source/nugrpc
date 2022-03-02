import { default as isValidJSON} from "validator/lib/isJSON"
import { default as isValidDate} from "validator/lib/isISO8601"
import { default as isValidEmail} from "validator/lib/isEmail"
import { default as isValidUUID} from "validator/lib/isUUID"
import { default as isValidPhone} from "validator/lib/isMobilePhone"
import { default as isValidInt} from "validator/lib/isInt"
import { default as isValidFloat} from "validator/lib/isFloat"
import { default as isValidURL} from "validator/lib/isURL"

import { createRule, Validator } from "../rule"
import { isString, isNumber, isDate as isDateType } from "../utils"
import { createRegexpRule } from "./match"
import {
  REGEX_ALPHA,
  REGEX_ALPHA_SPACE,
  REGEX_ALPHA_UNDERSCORE,
  REGEX_ALPHA_NUMERIC,
  REGEX_ALPHA_NUMERIC_SPACE,
  REGEX_ALPHA_NUMERIC_SPACE_SPECIAL_CHAR,
  REGEX_NUMERIC,
  REGEX_TIME,
  REGEX_LOWER_ALPHA_UNDERSCORE,
} from "../patterns"

type ParametersOf<F> = F extends (input: string, ...args: infer P) => boolean ? P : never

export function isAlpha (): Validator {
  return createRegexpRule('validation.error.must_be_alpha', REGEX_ALPHA)
}

export function isAlphaSpace (): Validator {
  return createRegexpRule('validation.error.must_be_alpha_space', REGEX_ALPHA_SPACE)
}

export function isAlphaUnderscore (): Validator {
  return createRegexpRule('validation.error.must_be_lower_alpha_underscore', REGEX_ALPHA_UNDERSCORE)
}

export function isLowerAlphaUnderscore(): Validator {
  return createRegexpRule('validation.error.must_be_lower_alpha_underscore', REGEX_LOWER_ALPHA_UNDERSCORE)
}

export function isAlphaNumeric (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric', REGEX_ALPHA_NUMERIC)
}

export function isDigit (): Validator {
  return createRegexpRule('validation.error.must_be_digit', REGEX_NUMERIC)
}

export function isAlphaNumericSpace (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric_space', REGEX_ALPHA_NUMERIC_SPACE)
}

export function isAlphaNumericSpaceAndSpecialCharacter (): Validator {
  return createRegexpRule('validation.error.must_be_alphanumeric_space_special_character', REGEX_ALPHA_NUMERIC_SPACE_SPECIAL_CHAR)
}

export function isDate(...parameters: ParametersOf<typeof isValidDate>): Validator {
  return createRule('validation.error.must_be_date', (value) => {
    if (isDateType(value))
      return true

    if (isString(value))
      return isValidDate(value, ...parameters)

    return false
  })
}

export function isTime(): Validator {
  return createRule('validation.error.must_be_time', (value) => {
    if (isDateType(value))
      return true

    if (isString(value))
      return REGEX_TIME.test(value)

    return false
  })
}

export function isUuid(...parameters: ParametersOf<typeof isValidUUID>): Validator {
  return createRule('validation.error.must_be_uuid', (value) => {
    return isString(value) && isValidUUID(value, ...parameters)
  })
}

export function isEmail(...parameters: ParametersOf<typeof isValidEmail>): Validator {
  return createRule('validation.error.must_be_email', (value) => {
    return isString(value) && isValidEmail(value, ...parameters)
  })
}

export function isPhone(...parameters: ParametersOf<typeof isValidPhone>): Validator {
  return createRule('validation.error.must_be_phone', (value) => {
    return isString(value) && isValidPhone(value, ...parameters)
  })
}

export function isJson(...parameters: ParametersOf<typeof isValidJSON>): Validator {
  return createRule('validation.error.must_be_json', (value) => {
    return isString(value) && isValidJSON(value, ...parameters)
  })
}

export function isUrl(...parameters: ParametersOf<typeof isValidURL>): Validator {
  return createRule('validation.error.must_be_url', (value) => {
    return isString(value) && isValidURL(value, ...parameters)
  })
}

export function isInt(): Validator {
  return createRule('validation.error.must_be_integer', (value) => {
    if (isNumber(value))
      return Number.isInteger(value)

    if (isString(value))
      return isValidInt(value)

    return false
  })
}

export function isFloat(): Validator {
  return createRule('validation.error.must_be_float', (value) => {
    if (isNumber(value))
      return true

    if (isString(value))
      return isValidFloat(value)

    return false
  })
}

export { isDigit as isNumeric }
