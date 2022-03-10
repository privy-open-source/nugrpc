
import { TransformAdapter } from '@privyid/nugrpc-transformer'
import { load } from '@privyid/nugrpc-utils'
import Transformer from '.'
import fs from "fs"
import path from "pathe"

describe('Transformer Rules', () => {
  it('should be an adapter', () => {
    const transformer = new Transformer({})

    expect(transformer).toBeInstanceOf(TransformAdapter)
    expect(typeof transformer.transform).toBe('function')
    expect(typeof transformer.toString).toBe('function')
  })

  it('should be able to transform protobuff into ts', () => {
    const root     = load(path.resolve(__dirname, '../../../sample/sample-with-rule.proto'))
    const expected = fs.readFileSync(path.resolve(__dirname, '../../../sample/sample.rules.ts')).toString()
    const result   = new Transformer({}).process(root).toString()

    expect(result).toStrictEqual(expected)
  })
})
