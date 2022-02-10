import { Rule, ValidationResult, validateRules } from ".."

export type ObjectRule<T> = {
  [K in keyof T]: Rule<T[K]> | Array<Rule<T[K]>>;
}

export type ObjectResult<T> = ValidationResult & {
  [K in keyof T]: T[K];
}

export function object<R>(schema: ObjectRule<R>): Rule<ObjectResult<R>> {
  return {
    validate (values) {
      const keys    = Object.keys(schema) as Array<string & keyof R>
      const entries = [] as Array<[keyof R, ValidationResult]>
      const result  = {
        $valid  : true,
        $message: '',
      } as ValidationResult

      for (let i = 0; i < keys.length; i++) {
        const key   = keys[i]
        const rules = schema[key]
        const value = values?.[key]
        const check = Array.isArray(rules)
          ? validateRules(rules, value)
          : rules.validate(value) as unknown as ValidationResult

        result.$valid = result.$valid && check.$valid

        entries.push([key, check])
      }

      if (!result.$valid)
        result.$message = 'validation.error.object'

      return Object.assign(result, Object.fromEntries(entries)) as any
    }
  }
}

export default object
