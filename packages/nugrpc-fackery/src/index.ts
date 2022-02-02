import {
  Context,
  PrimitiveType,
  PrimitiveValueOf,
  Type,
} from "./schema"

export {
  createString as string,
  createNumber as number,
  createBoolean as boolean,
  createArray as array,
  createObject as object,
} from './schema'

export type RuleHandler<T extends PrimitiveType> = () => PrimitiveValueOf<T>

export type TypedRule<T extends PrimitiveType> = {
  type: T,
  handler: RuleHandler<T>
}

export type Matcher = ((name: string) => boolean) | RegExp | string[] | string

export type Rule = (TypedRule<'string'> | TypedRule<'number'> | TypedRule<'boolean'>) & {
  name?: Matcher;
  modelName?: Matcher;
}

export function isMatch (text: string, rule: Matcher): boolean {
  if (rule instanceof RegExp)
    return rule.test(text)

  if (typeof rule === 'function')
    return rule(text)

  if (Array.isArray(rule))
    return rule.includes(text)

  return rule === text
}

export interface FackeryOptions {
  presets: Rule[];
}

export class Fackery {
  protected presets: Rule[];
  protected memoize: Map<string, Rule['handler']>;

  constructor (params: FackeryOptions) {
    this.presets = params.presets
    this.memoize = new Map()
  }

  private getHandler (context: Context): Rule['handler'] | never {
    const index = `${context.type}-${context.name}-${context.modelName}`

    // Get from cache if exist
    if (this.memoize.has(index))
      return this.memoize.get(index)

    const rule = this.presets.find((rule) => {
      return Object.keys(context)
        .every((k) => {
          if (rule[k])
            return isMatch(context[k], rule[k])

          return true
        })
    })

    if (!rule || !rule.handler)
      throw new Error(`Cannot resolve type ${context.type}`)

    // Save into memoize's cache
    this.memoize.set(index, rule.handler)

    return rule.handler
  }

  private resolve (context: Context): ReturnType<Rule['handler']> {
    return this.getHandler(context).call(this, context)
  }

  public create<T>(schema: Type<T>): T {
    return schema({}, this.resolve.bind(this))
  }
}
