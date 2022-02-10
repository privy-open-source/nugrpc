export type ValidationResult = {
  $valid  : boolean;
  $message: string;
}

export type Rule<R = ValidationResult> = {
  validate: (value: any) => R;
}

export function validateRules (rules: Array<Rule<any>>, value: any): ValidationResult {
  const result: ValidationResult = {
    $valid  : true,
    $message: '',
  }

  for (let i = 0; i < rules.length; i++) {
    const rule  = rules[i]
    const check = rule.validate(value) as ValidationResult

    if (!check.$valid) {
      result.$valid   = check.$valid
      result.$message = check.$message

      break
    }
  }

  return result
}

export function createRule(name: string, validate: (value: any) => boolean): Rule<ValidationResult> {
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
