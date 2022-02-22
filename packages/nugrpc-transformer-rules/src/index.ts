import { snakeCase, camelCase } from "lodash"
import { TransformAdapter, TransformContext, Saveable } from "@privyid/nugrpc-transformer"
import { isType, ReflectionObject, getModelName, Type, Model, isModel, Field } from "@privyid/nugrpc-utils"
import { parse, Rule } from "@privyid/nugrpc-rules-parser"
import TextWriter from "@privyid/nugrpc-writer"
import { normalizeCondition } from "./normalizer"

export default class TransformerRules extends TransformAdapter implements Saveable {
  private writer: TextWriter
  private importDeps: Map<string, Set<string>>
  private lookupDeps: Map<string, string>

  constructor (context: TransformContext) {
    super(context)

    this.writer     = new TextWriter()
    this.importDeps = new Map()
    this.lookupDeps = new Map([
      ['required', '@privyid/nugrpc-validator'],
      ['minValue', '@privyid/nugrpc-validator'],
      ['maxValue', '@privyid/nugrpc-validator'],
      ['minLength', '@privyid/nugrpc-validator'],
      ['maxLength', '@privyid/nugrpc-validator'],
      ['length', '@privyid/nugrpc-validator'],
      ['isAlpha', '@privyid/nugrpc-validator'],
      ['isAlphaSpace', '@privyid/nugrpc-validator'],
      ['isAlphaUnderscore', '@privyid/nugrpc-validator'],
      ['isLowerAlphaUnderscore', '@privyid/nugrpc-validator'],
      ['isDigit', '@privyid/nugrpc-validator'],
      ['isAlphaNumeric', '@privyid/nugrpc-validator'],
      ['isAlphaNumericSpace', '@privyid/nugrpc-validator'],
      ['IsAlphaNumericSpaceAndSpecialCharacter', '@privyid/nugrpc-validator'],
      ['isDate', '@privyid/nugrpc-validator'],
      ['isTime', '@privyid/nugrpc-validator'],
      ['isUuid', '@privyid/nugrpc-validator'],
      ['isInt', '@privyid/nugrpc-validator'],
      ['isFloat', '@privyid/nugrpc-validator'],
      ['isPhone', '@privyid/nugrpc-validator'],
      ['isEmail', '@privyid/nugrpc-validator'],
      ['isUrl', '@privyid/nugrpc-validator'],
      ['isJson', '@privyid/nugrpc-validator'],
      ['object', '@privyid/nugrpc-validator'],
      ['each', '@privyid/nugrpc-validator'],
      ['when', '@privyid/nugrpc-validator'],
      ['equalTo', '@privyid/nugrpc-validator'],
    ])
  }

  addRule (name: string, from: string): this {
    this.lookupDeps.set(name, from)

    return this
  }

  requireDeps (name: string): this {
    const importFrom = this.lookupDeps.get(name)

    if (importFrom) {
      if (!this.importDeps.has(importFrom))
        this.importDeps.set(importFrom, new Set())

      this.importDeps.get(importFrom)?.add(name)
    }

    return this
  }

  getType (model: Model): string {
    return snakeCase(`${getModelName(model)}_rules`).toUpperCase()
  }

  getFieldType (field: Field): string {
    let rules = isModel(field.resolvedType)
      ? this.getType(field.resolvedType)
      : this.getRules(parse(field.comment ?? ''))

    if (field.repeated) {
      this.requireDeps('each')

      rules = `each(${rules})`
    }

    return rules
  }

  getRules (rules: Rule[]): string {
    const output = rules
      .map((rule) => {
        const name    = camelCase(rule.name)
        const options = rule.options.map((option) => {
          if (!Array.isArray(option))
            return option

          return this.getRules(option)
        })

        this.requireDeps(name)

        if (name === 'when')
          options[0] = normalizeCondition(options[0])

        return `${name}(${options})`
      })
      .join(', ')

    return `[${output}]`
  }

  transformType (node: Type) {
    const name = this.getType(node)

    this.requireDeps('object')
    this.writer.line()
    this.writer.write(`export const ${name} = object({`)
    this.writer.tab()

    for (const field of node.fieldsArray) {
      field.resolve()

      this.writer.write(`${field.name}: ${this.getFieldType(field)},`)
    }

    this.writer.tab(-1)
    this.writer.write('})')
  }

  transform (node: ReflectionObject): void {
    if (isType(node))
      this.transformType(node)
  }

  toString(): string {
    if (this.importDeps.size > 0) {
      const writer = new TextWriter()

      for (const [url, fns] of this.importDeps.entries()) {
        writer.write('import {')
        writer.tab(1)

        for (const fn of fns)
          writer.write(`${fn},`)

        writer.tab(-1)
        writer.write(`} from '${url}'`)
      }

      return `${writer.toString()}${this.writer.toString()}`
    }

    return this.writer.toString()
  }
}
