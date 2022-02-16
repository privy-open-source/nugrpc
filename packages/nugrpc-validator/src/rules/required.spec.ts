import { required } from './required'

describe('required', () => {
  it('should return true if value is not empty string', () => {
    const validator = required()

    expect(validator.validate('Hello').$valid).toBe(true)
  })

  it('should return true if value is valid number', () => {
    const validator = required()

    expect(validator.validate(15).$valid).toBe(true)
  })

  it('should return true if value is not empty array', () => {
    const validator = required()

    expect(validator.validate([1, 2, 3]).$valid).toBe(true)
  })

  it('should return false if value is empty string', () => {
    const validator = required()

    expect(validator.validate('').$valid).toBe(false)
  })

  it('should return false if value is not number', () => {
    const validator = required()
    const value     = Number.parseInt('heelo')

    expect(validator.validate(value).$valid).toBe(false)
  })

  it('should return false if value is empty array', () => {
    const validator = required()

    expect(validator.validate([]).$valid).toBe(false)
  })

  it('should return false if value is null', () => {
    const validator = required()

    expect(validator.validate(null).$valid).toBe(false)
  })

  it('should return false if value is undefined', () => {
    const validator = required()

    expect(validator.validate(undefined).$valid).toBe(false)
  })

  it('should return false if value is whitespace only string', () => {
    const validator = required()

    expect(validator.validate('         ').$valid).toBe(false)
    expect(validator.validate('        h').$valid).toBe(true)
  })
})
