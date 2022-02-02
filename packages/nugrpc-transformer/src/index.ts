import {
  isNamespace,
  ReflectionObject,
} from '@privyid/nugrpc-utils'

export interface TransformContext {
  baseUrl?: string;
  packageName?: string;
  packageVersion?: string;
}

export interface Transformable {
  process (node: ReflectionObject): this;
  transform (node: ReflectionObject): void;
}

export interface Saveable {
  toString (): string;
}

export abstract class TransformAdapter implements Transformable {
  protected context: TransformContext

  constructor (context: TransformContext) {
    this.context = context
  }

  abstract transform (node: ReflectionObject): void;

  /**
   * Traversing nodes tree using "Deep First Search Post Order" method
   * @param node {ReflectionObject}
   * @returns this
   */
  process (node: ReflectionObject) {
    if (isNamespace(node)) {
      for (const subnode of node.nestedArray)
        this.process(subnode)
    }

    this.transform(node)

    return this
  }
}
