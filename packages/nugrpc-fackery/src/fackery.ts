import { isMatch, Presets, Rule, sortRules } from "./rules"
import { TypeContext, Type } from "./schema"

export interface FackeryOptions {
  presets: Presets | Presets[];
}

export class Fackery {
  protected presets: Rule[]
  protected memoize: Map<string, Rule['handler']>

  constructor (params: FackeryOptions) {
    this.presets = sortRules(params.presets.flat())
    this.memoize = new Map()
  }

  protected findHandler (context: TypeContext): Rule['handler'] | never {
    const rule = this.presets.find((rule) => {
      return (Object.keys(context) as Array<keyof TypeContext>)
        .every((k) => {
          const matcher = rule[k]
          const text    = context[k]

          if (matcher)
            return text && isMatch(text, matcher)

          return true
        })
    })

    if (!rule || !rule.handler)
      throw new Error(`Cannot resolve type "${context.type}"`)

    return rule.handler
  }

  protected getHandler (context: TypeContext): Rule['handler'] | never {
    const hash = `${context.type}-${context.name}-${context.modelName}`

    // Get from cache if exist
    if (this.memoize.has(hash))
      return this.memoize.get(hash) as Rule['handler']

    // If not, find handler from presets
    const handler = this.findHandler(context)

    // Save into memoize's cache
    this.memoize.set(hash, handler)

    return handler
  }

  protected resolve (context: TypeContext): ReturnType<Rule['handler']> {
    return this.getHandler(context)()
  }

  public create<T> (schema: Type<T>): T {
    return schema({}, this.resolve.bind(this))
  }
}
