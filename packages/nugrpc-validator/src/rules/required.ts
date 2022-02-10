import { createRule, Rule, ValidationResult } from ".."

export function required(): Rule<ValidationResult> {
  return createRule('validation.error.required', (value) => {
    return value === undefined
      || value === null
      || Number.isNaN(value)
      || (Array.isArray(value) && value.length === 0)
      || (String(value).trim().length === 0)
  })
}

export default required
