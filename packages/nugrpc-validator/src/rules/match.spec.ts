import { match } from "./match"

describe('match', () => {
  it('should be return true if value match the regex pattern', () => {
    const validator = match(/\d{3}\.[a-z]{3}/)

    expect(validator.validate('123.abc').$valid).toBe(true)
  })

  it('should be return false if value not match the regex pattern', () => {
    const validator = match(/\d{3}\.[a-z]{3}/)

    expect(validator.validate('foobar').$valid).toBe(false)
  })
})
