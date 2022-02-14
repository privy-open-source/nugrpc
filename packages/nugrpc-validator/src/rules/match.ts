import { Validator } from ".."

export function createRegexpRule (name: string, regex: RegExp): Validator {
  return {
    validate (value) {
      const valid = !value || regex.test(String(value).trim())

      return {
        $valid  : valid,
        $message: valid === false ? name: '',
      }
    }
  }
}

export function match (regex: RegExp) {
  return createRegexpRule('validation.error.must_be_match', regex)
}

export default match
