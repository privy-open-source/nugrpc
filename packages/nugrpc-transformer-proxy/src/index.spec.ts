import { TransformAdapter } from '@privyid/nugrpc-transformer'
import Transformer from '.'

describe('Transformer TS', () => {
  it('should be an adapter', () => {
    const transformer = new Transformer({ target: '/' })

    expect(transformer).toBeInstanceOf(TransformAdapter)
    expect(typeof transformer.transform).toBe('function')
    expect(typeof transformer.toString).toBe('function')
  })
})
