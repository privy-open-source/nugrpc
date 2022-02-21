import { createRule, Validator, ValidationResult } from ".."
import { isEmptyArray, isEmptyString, isNotNumber, isNull, isNumber, isUndefined } from "../utils"

export function required(): Validator<ValidationResult> {
  return createRule('validation.error.required', (value) => {
    const isEmpty = isUndefined(value)
      || isNull(value)
      || isNotNumber(value)
      || isEmptyArray(value)
      || isEmptyString(value)

    return !isEmpty
  })
}

export default required
