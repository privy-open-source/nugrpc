import { Namespace, ReflectionObject, Root } from "protobufjs"
import { isNamespace, isPackageRoot } from "./is"

export function load (files: string | string[]): Root {
  return (new Root())
    .loadSync(files, {
      keepCase             : true,
      alternateCommentMode : true,
      preferTrailingComment: true,
    }).root
}

export function findPackageRoot (root: ReflectionObject): Namespace | undefined {
  const stack: ReflectionObject[] = [root]

  while (stack.length > 0) {
    const node = stack.shift()

    if (node && isNamespace(node)) {
      if (isPackageRoot(node))
        return node

      stack.push(...node.nestedArray)
    }
  }

  return undefined
}
