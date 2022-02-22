import {
  object,
  required,
  minLength,
  maxLength,
  minValue,
  isAlphaSpace,
  isUuid,
  isAlphaNumeric,
  when,
} from '@privyid/nugrpc-validator'

export const NORMAL_MESSAGE_RULES = object({
  single_rule: [required()],
  single_rule_wParantheses: [required()],
  multiple_rules: [required(), minLength(1), maxLength(5)],
  rule_on_top: [required(), minValue(1)],
  kebab_case: [required(), isAlphaSpace(), isUuid()],
  camel_case: [required(), isAlphaNumeric()],
  conditional_case: [when(({ single_rule }) => single_rule == "email",[required(), minLength(5)])],
})
