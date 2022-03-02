import { Validator, createRule, ValueKey } from "../rule"
import { get } from "../utils"

export function equalTo (key: string): Validator {
  return createRule('validation.error.must_be_equal', (value, values) => {
    return get(values, key as ValueKey) === value
  })
}
