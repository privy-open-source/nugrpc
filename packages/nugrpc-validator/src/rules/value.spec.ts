import { minValue, maxValue } from "./value"

describe('minValue', () => {
  it('should be return valid if input equal with expected value', () => {
    const input     = 10
    const validator = minValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should be return valid if input greater than expected value', () => {
    const input     = 15
    const validator = minValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should be return invalid if input less than expected value', () => {
    const input     = 7
    const validator = minValue(10)

    expect(validator.validate(input).$valid).toBe(false)
  })

  it('should be accept string as input', () => {
    const input     = '15'
    const validator = minValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should be return invalid if value is not number nor string', () => {
    const validator = minValue(10)

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
  })

  it('should be able to use date as parameter and input', () => {
    const min       = new Date('2022-02-10')
    const validator = minValue(min)

    expect(validator.validate(new Date('2022-02-15')).$valid).toBe(true)
    expect(validator.validate(new Date('2022-02-01')).$valid).toBe(false)
  })
})

describe('maxValue', () => {
  it('should be return valid if input equal with expected value', () => {
    const input     = 10
    const validator = maxValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should be return invalid if input greater than expected value', () => {
    const input     = 15
    const validator = maxValue(10)

    expect(validator.validate(input).$valid).toBe(false)
  })

  it('should be return valid if input less than expected value', () => {
    const input     = 7
    const validator = maxValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should be accept string as input', () => {
    const input     = '7'
    const validator = maxValue(10)

    expect(validator.validate(input).$valid).toBe(true)
  })

  it('should return invalid if value is not number nor string', () => {
    const validator = maxValue(10)

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
  })

  it('should be able to use date as parameter and input', () => {
    const min       = new Date('2022-02-10')
    const validator = maxValue(min)

    expect(validator.validate(new Date('2022-02-7')).$valid).toBe(true)
    expect(validator.validate(new Date('2022-02-20')).$valid).toBe(false)
  })
})
