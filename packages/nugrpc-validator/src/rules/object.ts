import { Validator, ValidationResult, validateRules } from ".."

export type ObjectRule<T> = {
  [K in keyof T]: Validator<T[K]> | Array<Validator<T[K]>>;
}

export type ObjectResult<T> = ValidationResult & {
  [K in keyof T]: T[K];
}

export interface ObjectValidator<T> extends Validator<ObjectResult<T>> {
  validateOnly<K extends keyof T> (keys: Array<K>, value: any, values?: any): ObjectResult<Pick<T, K>>;
}

export function object<T>(schema: ObjectRule<T>): ObjectValidator<T> {
  return {
    validateOnly (keys, values) {
      const entries = [] as Array<[keyof T, ValidationResult]>
      const result  = {
        $valid  : true,
        $message: '',
      } as ValidationResult

      for (const key of keys) {
        const rules = schema[key]
        const value = values?.[key]
        const check = Array.isArray(rules)
          ? validateRules(rules, value)
          : rules.validate(value, values) as unknown as ValidationResult

        result.$valid = result.$valid && check.$valid

        entries.push([key, check])
      }

      if (!result.$valid)
        result.$message = 'validation.error.object'

      return Object.assign(result, Object.fromEntries(entries)) as unknown as ObjectResult<T>
    },

    validate (values) {
      return this.validateOnly(Object.keys(schema) as Array<keyof T>, values)
    },
  }
}

export default object
