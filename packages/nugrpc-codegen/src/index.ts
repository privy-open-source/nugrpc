import {
  isNamespace,
  ReflectionObject,
} from '@privyid/nugrpc-utils'

export interface TransformContext {
  baseUrl?: string;
  packageName?: string;
  packageVersion?: string;
}

export abstract class TransformAdapter {
  constructor (context: TransformContext) { }

  abstract transform (node: ReflectionObject): void;
  abstract toString (): string;

  process (node: ReflectionObject) {
    // Deep first search, post-order

    if (isNamespace(node)) {
      for (const subnode of node.nestedArray)
        this.process(subnode)
    }

    this.transform(node)

    return this
  }
}
