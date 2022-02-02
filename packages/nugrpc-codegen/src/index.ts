import fs from 'fs-extra'
import path from 'path'
import { load } from '@privyid/nugrpc-utils'
import { TransformContext, TransformAdapter, Saveable } from '@privyid/nugrpc-transformer'

export type Transformer = { new(context: TransformContext): TransformAdapter } & typeof TransformAdapter & Saveable
export interface InputOption {
  input: string | string[];
  output: string;
  transformer: Transformer;
  transformerContext?: TransformContext;
}

export function generate (options: InputOption | InputOption[]) {
  if (!Array.isArray(options))
    return generate([options])

  for (const option of options) {
    const Formatter = option.transformer
    const files     = option.input
    const output    = option.output
    const context   = option.transformerContext ?? {}
    const root      = load(files)

    const formatter   = new Formatter(context)
    const result      = formatter.process(root).toString()
    const destination = path.posix.resolve(output)

    fs.ensureFileSync(destination)
    fs.writeFileSync(destination, result)
  }
}

export default generate
