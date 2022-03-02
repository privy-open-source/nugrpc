import { pascalCase } from "@privyid/nugrpc-utils"

const RULE_COMMENT_REGEX = /^@rules:\s*?([\w-]+\s*?(?:\(.*?\))?(?:\s*?\|\s*?[\w-]+\s*?(?:\(.*?\))?)*)$/i

const RULE_REGEX = /^([\w-]+)\s*?(?:\((.*)\))?$/

const ESCAPE_CHAR = "\\"

/**
 * Available "shortcut" tag list
 */
const SHORTCUT: Record<string, string> = {
  "required": "Required",
  "optional": "NilOrEmpty"
}

/**
 * List symbol which always come in pair
 */
const PAIR_SYMBOLS: Record<string, string> = {
  "\"": "\"",
  "\'": "\'",
  "(" : ")",
  "/" : "/",
  "{" : "}",
  "[" : "]",
}

/**
 * List rule which has subrule on their options
 */
const HAS_SUBRULE: Record<string, number[]> = {
  // 2st parameters of When is sub-rules
  "When": [1],
  // 1st parameters of Each is sub-rules
  "Each": [0],
  // 1st parameters of Else is sub-rules
  "Else": [0],
}

export interface Rule {
  name: string;
  options: Array<string | Rule[]>;
}

export function isShortcutTag (text: string): boolean {
  return Object.keys(SHORTCUT).some((key) => {
    return String(text).toLowerCase().startsWith(`@${key}`)
  })
}

export function isValid (text: string): boolean {
  return isShortcutTag(text)
    || RULE_COMMENT_REGEX.test(text)
}

export function splitBy (params: string, delimiter: string): string[] {
  const result: string[] = []
  const lookup: string[] = []

  for (let i = 0, start = 0; i < params.length; i++) {
    const char = params[i]

    if (char === ESCAPE_CHAR)
      i += 1
    else if (lookup[lookup.length - 1] === char)
      lookup.pop()
    else if (PAIR_SYMBOLS[char])
      lookup.push(PAIR_SYMBOLS[char])

    if (lookup.length === 0) {
      if (char === delimiter) {
        result.push(params.slice(start, i).trim())

        start = i + 1

        continue
      }

      if (i === params.length - 1)
        result.push(params.slice(start).trim())
    }
  }

  return result
}

export function parseRule (text: string): Rule {
  const match        = text.trim().match(RULE_REGEX)
  const name         = pascalCase(match?.[1] ?? /* istanbul ignore next */ '')
  const parameters   = splitBy(match?.[2] ?? '', ',')
  const rule: Rule   = { name, options: parameters }
  const subRuleIndex = HAS_SUBRULE[name]

  if (subRuleIndex) {
    for (const i of subRuleIndex) {
      rule.options[i] = splitBy(parameters[i], '|')
        .map((subrule) => parseRule(subrule))
    }
  }

  return rule
}

export function parse (text: string): Rule[] {
  const shortcutKey = Object.keys(SHORTCUT)
    .find((key) => {
      return String(text)
        .toLowerCase()
        .startsWith(`@${key}`)
    })

  if (shortcutKey) {
    return [{
      name   : SHORTCUT[shortcutKey],
      options: [],
    }]
  }

  const syntax = text.match(RULE_COMMENT_REGEX)
  const rules  = syntax?.[1]

  if (rules) {
    return splitBy(rules, '|')
      .map((rule) => parseRule(rule))
  }

  return []
}
