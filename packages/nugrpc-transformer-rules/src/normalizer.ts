import {
  Expression,
  PrivateName,
  isLogicalExpression,
  isBinaryExpression,
  isIdentifier,
  isUnaryExpression,
  arrowFunctionExpression,
  objectProperty,
  objectPattern,
  identifier,
} from "@babel/types"
import { parseExpression } from "@babel/parser"
import generate from "@babel/generator"

export function normalizeCondition (condition: string): string {
  const ast                                    = parseExpression(condition)
  const queue: Array<Expression | PrivateName> = [ast]
  const ids: Set<string>                       = new Set()

  while (queue.length > 0) {
    const node = queue.shift()

    if (isLogicalExpression(node) || isBinaryExpression(node)) {
      queue.push(node.left)
      queue.push(node.right)
    } else if (isUnaryExpression(node)) {
      queue.push(node.argument)
    } else if (isIdentifier(node)) {
      ids.add(node.name)
    }
  }

  const params   = objectPattern([...ids].map((name) => objectProperty(identifier(name), identifier(name), false, true)))
  const { code } = generate(arrowFunctionExpression([params], ast), { concise: true })

  return code
}
