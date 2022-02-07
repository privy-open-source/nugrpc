import { load, ReflectionObject } from "@privyid/nugrpc-utils"
import { TransformAdapter, TransformContext } from "."
import path from 'path'

describe('Transfomer Base Class', () => {
  it('should travel nodes tree and calling .process()', () => {
    const fn = jest.fn()

    class MockAdapter extends TransformAdapter {
      constructor (context: TransformContext) {
        super(context)
      }

      transform (node: ReflectionObject): void {
        fn(node)
      }
    }

    const nodes   = load(path.resolve(__dirname, '../../../sample/sample.proto'))
    const adapter = new MockAdapter({}).process(nodes)

    expect(adapter).toBeInstanceOf(TransformAdapter)
    expect(fn).toBeCalled()
  })
})
