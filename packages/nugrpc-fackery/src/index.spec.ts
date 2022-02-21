import Fackery, * as utils from '.'

describe('Entrypoint (index.ts)', () => {
  function isClass (func: unknown): boolean {
    return typeof func === 'function'
      && /^class\s/.test(Function.prototype.toString.call(func));
  }

  it('should export Fackery Class', () => {
    expect(isClass(Fackery)).toBe(true)
  })

  it('should export function string', () => {
    expect(typeof utils.string).toBe('function')
  })

  it('should export function number', () => {
    expect(typeof utils.number).toBe('function')
  })

  it('should export function boolean', () => {
    expect(typeof utils.boolean).toBe('function')
  })

  it('should export function array', () => {
    expect(typeof utils.array).toBe('function')
  })

  it('should export function object', () => {
    expect(typeof utils.object).toBe('function')
  })

  it('should export function tuple', () => {
    expect(typeof utils.tuple).toBe('function')
  })
})
