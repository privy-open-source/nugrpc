import { Validator, validateRules, ValidationResult } from ".."
import { maxLength, minLength } from "./length"

export class ArrayResult<R> extends Array<R> implements ValidationResult {
  public $valid: boolean  = true
  public $message: string = ''

  constructor (initial: ValidationResult) {
    super()

    this.$valid   = initial.$valid
    this.$message = initial.$message
  }
}

export interface EachValidator<R> extends Validator<ArrayResult<R>> {
  minLength(length: number): this;
  maxLength(length: number): this;
}

export function each<R>(rules: Validator<R> | Array<Validator<R>>): EachValidator<R> {
  const arrayRules: Validator[] = []

  return {
    minLength (length) {
      arrayRules.push(minLength(length))

      return this
    },
    maxLength (length) {
      arrayRules.push(maxLength(length))

      return this
    },
    validate (values) {
      const result = new ArrayResult<R>(validateRules(arrayRules, values))

      if (Array.isArray(values) && result.$valid) {
        for (const value of values) {
          const check = Array.isArray(rules)
            ? validateRules(rules, value)
            : rules.validate(value) as unknown as ValidationResult

          result.$valid = result.$valid && check.$valid

          result.push(check as unknown as R)
        }

        if (!result.$valid)
          result.$message = 'validation.error.each'
      }

      return result
    }
  }
}

export { each as repeat }

export default each
