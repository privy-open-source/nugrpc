import { createRule, Validator } from ".."

export function mustBeIn (...inValues: Array<string | number>): Validator {
  return createRule('validation.error.must_be_in', (value) => {
    if (value)
      return inValues.includes(value)

    return true
  })
}

export default mustBeIn
