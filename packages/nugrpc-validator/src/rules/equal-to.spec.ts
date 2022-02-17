import { object } from './object'
import { equalTo } from './equal-to'

describe('equalTo', () => {
  it('should return true if value equalTo another field', () => {
    const validator = object({
      password        : [],
      password_confirm: [equalTo('password')],
    })

    const result = validator.validate({
      password        : '123456',
      password_confirm: '123456',
    })

    expect(result.$valid).toBe(true)
    expect(result.password_confirm.$valid).toBe(true)
  })

  it('should return false if value not equalTo another field', () => {
    const validator = object({
      password        : [],
      password_confirm: [equalTo('password')],
    })

    const result = validator.validate({
      password        : '123456',
      password_confirm: '654321',
    })

    expect(result.$valid).toBe(false)
    expect(result.password_confirm.$valid).toBe(false)
    expect(result.password_confirm.$message).toBe('validation.error.must_be_equal')
  })
})
