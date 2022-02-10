import { TransformAdapter, TransformContext, Saveable } from "@privyid/nugrpc-transformer"
import { ReflectionObject } from "@privyid/nugrpc-utils"

export default class TransformerRules extends TransformAdapter implements Saveable {
  constructor(context: TransformContext) {
    super(context)
  }

  transform (node: ReflectionObject): void {
    throw new Error("Method not implemented.")
  }
}
