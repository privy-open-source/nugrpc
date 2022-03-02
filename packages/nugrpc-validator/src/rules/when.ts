import { Validator, validateRules, ValidationResult, ObjectValue } from "../rule"

export type WhenCondition = (values: ObjectValue) => boolean;

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
