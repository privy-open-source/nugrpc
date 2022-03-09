import { load } from "@privyid/nugrpc-utils"
import { TransformAdapter } from "@privyid/nugrpc-transformer"
import * as path from "pathe"
import * as fs from "fs"
import Transformer from "."

describe('Transformer Swagger', () => {
  it('should be an adapter', () => {
    const transformer = new Transformer({})

    expect(transformer).toBeInstanceOf(TransformAdapter)
    expect(typeof transformer.transform).toBe('function')
    expect(typeof transformer.toString).toBe('function')
  })

  it('should be able to transform protobuff into swagger config', () => {
    const root     = load(path.resolve(__dirname, '../../../sample/sample.proto'))
    const expected = fs.readFileSync(path.resolve(__dirname, '../../../sample/sample.swagger.json')).toString()
    const result   = new Transformer({}).process(root).toString()

    expect(result).toEqual(expected)
  })
})
