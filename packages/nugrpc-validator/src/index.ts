export type ValidationResult = {
  $valid  : boolean;
  $message: string;
}

export type Validator<R = ValidationResult> = {
  validate (value: any, values?: any): R;
}

export function validateRules (rules: Array<Validator<any>>, value: any, values?: any): ValidationResult {
  const result: ValidationResult = {
    $valid  : true,
    $message: '',
  }

  for (let i = 0; i < rules.length; i++) {
    const rule  = rules[i]
    const check = rule.validate(value, values) as ValidationResult

    if (!check.$valid) {
      result.$valid   = check.$valid
      result.$message = check.$message

      break
    }
  }

  return result
}

export function createRule(name: string, validate: (value: any) => boolean): Validator<ValidationResult> {
  return {
    validate (value) {
      const valid = validate(value)

      return {
        $valid  : valid,
        $message: valid === false ? name: '',
      }
    }
  }
}
