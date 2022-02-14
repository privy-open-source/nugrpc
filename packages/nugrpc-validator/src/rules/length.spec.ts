import { length, minLength, maxLength } from './length'

describe('length', () => {
  it('should be valid if string has equal length', () => {
    const text      = '12345'
    const validator = length(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should be invalid if string has less length', () => {
    const text      = '1234'
    const validator = length(5)

    expect(validator.validate(text).$valid).toBe(false)
  })

  it('should be invalid if string has greater length', () => {
    const text      = '1234567'
    const validator = length(5)

    expect(validator.validate(text).$valid).toBe(false)
  })

  it('should not count whitespace in front of text', () => {
    const text      = '         12345'
    const validator = length(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should not count whitespace in end of text', () => {
    const text      = '12345    '
    const validator = length(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('whitespace is middle of text is ok', () => {
    const text      = 'lorem ipsum'
    const validator = length(11)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should accept value array too', () => {
    const items     = ['item a', 'item b', 'item c']
    const validator = length(3)

    expect(validator.validate(items).$valid).toBe(true)
  })

  it('should return false if value is not string or array', () => {
    const validator = length(3)

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
    expect(validator.validate(Symbol).$valid).toBe(false)
  })
})

describe('minLength', () => {
  it('should be valid if string has equal length', () => {
    const text      = '12345'
    const validator = minLength(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should be invalid if string has less length', () => {
    const text      = '1234'
    const validator = minLength(5)

    expect(validator.validate(text).$valid).toBe(false)
  })

  it('should be valid if string has greater length', () => {
    const text      = '1234567'
    const validator = minLength(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should not count whitespace in front of text', () => {
    const text      = '         12345'
    const validator = minLength(3)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should not count whitespace in end of text', () => {
    const text      = '12345    '
    const validator = minLength(3)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('whitespace is middle of text is ok', () => {
    const text      = 'lorem ipsum'
    const validator = minLength(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should accept value array too', () => {
    const items     = ['item a', 'item b', 'item c']
    const validator = minLength(2)

    expect(validator.validate(items).$valid).toBe(true)
  })

  it('should return invalid if value is not string or array', () => {
    const validator = minLength(3)

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
    expect(validator.validate(Symbol).$valid).toBe(false)
  })
})

describe('maxLength', () => {
  it('should be valid if string has equal length', () => {
    const text      = '12345'
    const validator = maxLength(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should be valid if string has less length', () => {
    const text      = '1234'
    const validator = maxLength(5)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should be invalid if string has greater length', () => {
    const text      = '1234567'
    const validator = maxLength(5)

    expect(validator.validate(text).$valid).toBe(false)
  })

  it('should not count whitespace in front of text', () => {
    const text      = '         12345'
    const validator = maxLength(7)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should not count whitespace in end of text', () => {
    const text      = '12345    '
    const validator = maxLength(7)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('whitespace is middle of text is ok', () => {
    const text      = 'lorem ipsum'
    const validator = maxLength(15)

    expect(validator.validate(text).$valid).toBe(true)
  })

  it('should accept value array too', () => {
    const items     = ['item a', 'item b', 'item c']
    const validator = maxLength(5)

    expect(validator.validate(items).$valid).toBe(true)
  })

  it('should return false if value is not string or array', () => {
    const validator = maxLength(3)

    expect(validator.validate(null).$valid).toBe(false)
    expect(validator.validate(undefined).$valid).toBe(false)
    expect(validator.validate({}).$valid).toBe(false)
    expect(validator.validate(Infinity).$valid).toBe(false)
    expect(validator.validate(NaN).$valid).toBe(false)
    expect(validator.validate(Symbol).$valid).toBe(false)
  })
})
