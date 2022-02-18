import { isObject } from "./utils"

export type ValidationResult = {
  $valid  : boolean;
  $message: string;
}

export type Value = string | number | boolean | null | undefined | Date | Value[] | ObjectValue

export type ObjectValue = { [Key in string]: Value }

export type ValueKey = string & keyof Value

export type Validator<R = ValidationResult> = {
  validate (value: Value, values?: ObjectValue): R;
}

export function validateRules (rules: Array<Validator<unknown>>, value: Value, values?: Value): ValidationResult {
  const result: ValidationResult = {
    $valid  : true,
    $message: '',
  }

  for (let i = 0; i < rules.length; i++) {
    const rule  = rules[i]
    const check = rule.validate(value, isObject(values) ? values : {}) as ValidationResult

    if (!check.$valid) {
      result.$valid   = check.$valid
      result.$message = check.$message

      break
    }
  }

  return result
}

export function createRule (name: string, validate: (value: Value, values?: ObjectValue) => boolean): Validator<ValidationResult> {
  return {
    validate (...parameters) {
      const valid = validate(...parameters)

      return {
        $valid  : valid,
        $message: valid === false ? name: '',
      }
    }
  }
}
