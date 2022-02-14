import { createRule, Validator, ValidationResult } from ".."

export function required(): Validator<ValidationResult> {
  return createRule('validation.error.required', (value) => {
    const isEmpty = value === undefined
      || value === null
      || Number.isNaN(value)
      || (Array.isArray(value) && value.length === 0)
      || (String(value).trim().length === 0)

    return !isEmpty
  })
}

export default required
