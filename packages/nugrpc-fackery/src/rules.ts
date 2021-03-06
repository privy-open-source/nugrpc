import { PrimitiveType, PrimitiveValueOf } from "./schema"
import safeRegex from "safe-regex"

export type RuleHandler<T extends PrimitiveType> = () => PrimitiveValueOf<T>

export type TypedRule<T extends PrimitiveType> = {
  type: T;
  handler: RuleHandler<T>;
}

export type Matcher = ((name: string) => boolean) | RegExp | string[] | string

export type Rule = (TypedRule<'string'> | TypedRule<'number'> | TypedRule<'boolean'>) & {
  format?: Matcher;
  name?: Matcher;
  modelName?: Matcher;
}

export type Presets = Rule[]

export function isMatch (text: string, rule: Matcher): boolean {
  if (rule instanceof RegExp && safeRegex(rule))
    return rule.test(text)

  if (typeof rule === 'function')
    return rule(text)

  if (Array.isArray(rule))
    return rule.includes(text)

  return rule === text
}

export function measureMatcher (matcher: Matcher): number {
  if (typeof matcher === 'function')
    return 1

  if (matcher instanceof RegExp)
    return 2

  if (Array.isArray(matcher))
    return 3

  return 4
}

export function measurePriorities (rule: Rule): number {
  let result = 1

  if (rule.modelName !== undefined)
    result += measureMatcher(rule.modelName) * 1000

  if (rule.name !== undefined)
    result += measureMatcher(rule.name) * 100

  if (rule.format !== undefined)
    result += measureMatcher(rule.format) * 10

  return result
}

export function sortRules (rules: Rule[]): Rule[] {
  return rules.slice().sort((a, b) => {
    return measurePriorities(b) - measurePriorities(a)
  })
}
