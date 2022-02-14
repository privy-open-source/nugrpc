import { Validator, validateRules, ValidationResult } from ".."

export class ArrayResult<R> extends Array<R> implements ValidationResult {
  public $valid: boolean  = true
  public $message: string = ''

  constructor (initial: ValidationResult) {
    super()

    this.$valid   = initial.$valid
    this.$message = initial.$message
  }
}

export function each<R>(rules: Validator<R> | Array<Validator<R>>, allowEmpty = false): Validator<ArrayResult<R>> {
  return {
    validate (values) {
      const result = new ArrayResult<R>({
        $valid  : !allowEmpty,
        $message: 'validation.error.each',
      })

      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          const value = values[i]
          const check = Array.isArray(rules)
            ? validateRules(rules, value)
            : rules.validate(value) as unknown as ValidationResult

          result.$valid = i > 0
            ? result.$valid && check.$valid
            : check.$valid

          result.push(check as unknown as R)
        }
      }

      if (result.$valid)
        result.$message = ''

      return result
    }
  }
}

export { each as repeat }

export default each
