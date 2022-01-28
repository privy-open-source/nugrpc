import { load } from "@privyid/nugrpc-utils"
import { TransformAdapter } from "@privyid/nugrpc-codegen"
import * as path from "path"
import * as fs from "fs"
import Transformer from "."

describe('Transformer TS', () => {
  it('should be an adapter', () => {
    const transformer = new Transformer({})

    expect(transformer).toBeInstanceOf(TransformAdapter)
    expect(typeof transformer.transform).toBe('function')
    expect(typeof transformer.toString).toBe('function')
  })

  it('should be able to transform protobuff into ts', () => {
    const root     = load(path.resolve(__dirname, '../fixtures/sample.proto'))
    const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/sample.output')).toString()
    const result   = new Transformer({}).process(root).toString()

    expect(result).toBe(expected)
  })
})
