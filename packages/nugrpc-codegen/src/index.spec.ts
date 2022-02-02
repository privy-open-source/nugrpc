import path from 'path'
import { generate, InputOption, Transformer } from '.'
import TransformerTS from '@privyid/nugrpc-transformer-ts'
import TransformerSwagger from '@privyid/nugrpc-transformer-swagger'
import fs from 'fs-extra'

describe('Code Generator', () => {
  const casses: Array<[string, Transformer, string]> = [
    ['TS',      TransformerTS,        '../../../sample/sample.ts'],
    ['Swagger', TransformerSwagger,   '../../../sample/sample.swagger.json'],
  ]

  it.each(casses)('should be can generate using %s transformer', (name, TransformerClass, samplePath) => {
    const options: InputOption = {
      input      : path.resolve(__dirname, '../../../sample/sample.proto'),
      output     : path.resolve(__dirname, `temp/output-${name}`),
      transformer: TransformerClass,
    }

    generate(options)

    const expected = fs.readFileSync(path.resolve(__dirname, samplePath)).toString()
    const output   = fs.readFileSync(options.output).toString()

    expect(fs.existsSync(options.output))
    expect(output).toBe(expected)
  })

  afterAll(() => {
    fs.removeSync(path.resolve(__dirname, 'temp'))
  })
})
