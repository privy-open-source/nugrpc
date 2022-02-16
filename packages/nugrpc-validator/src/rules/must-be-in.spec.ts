import { mustBeIn } from "./must-be-in"

describe('mustBeIn', () => {
  it('should return true if value is one of the list', () => {
    const validator = mustBeIn('one', 'two', 'three')
    const input     = 'one'

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should return false if value is not one of the list', () => {
    const validator = mustBeIn('one', 'two', 'three')
    const input     = 'four'

    expect(validator.validate(input).$valid).toBe(false)
  })

  it('should return true if value is one of the numbers', () => {
    const validator = mustBeIn(1, 2, 3)
    const input     = 1

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should return false if value is not one of the numbers', () => {
    const validator = mustBeIn(1, 2, 3)
    const input     = 4

    expect(validator.validate(input).$valid).toBe(false)
  })

  it('should accept array as parameters', () => {
    const list      = ['one', 'two', 'three']
    const validator = mustBeIn(list)
    const input     = 'one'

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should return false if value not string or number', () => {
    const validator = mustBeIn('one', 'two', 'three')

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
    /* @ts-expect-error */
    expect(validator.validate(Symbol()).$valid).toBe(false)
  })
})
