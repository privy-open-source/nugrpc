import { Validator, validateRules, ValidationResult } from ".."

export type WhenCondition = (values: any) => boolean;

export function when (condition: WhenCondition, ifTrue: Validator[], ifFalse: Validator[] = []): Validator {
  return {
    validate (value, values = {}) {
      const rules = condition(values)
        ? ifTrue
        : ifFalse

      return validateRules(rules, value) as unknown as ValidationResult
    }
  }
}
