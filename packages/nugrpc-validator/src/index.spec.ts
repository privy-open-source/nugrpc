import * as validator from '.'

describe('Entrypoint', () => {
  it('should export function required()', () => {
    expect(typeof validator.required).toBe('function')
  })

  it('should export function minValue()', () => {
    expect(typeof validator.minValue).toBe('function')
  })

  it('should export function maxValue()', () => {
    expect(typeof validator.maxValue).toBe('function')
  })

  it('should export function minLength()', () => {
    expect(typeof validator.minLength).toBe('function')
  })

  it('should export function maxLength()', () => {
    expect(typeof validator.maxLength).toBe('function')
  })

  it('should export function length()', () => {
    expect(typeof validator.length).toBe('function')
  })

  it('should export function isAlpha()', () => {
    expect(typeof validator.isAlpha).toBe('function')
  })

  it('should export function isAlphaSpace()', () => {
    expect(typeof validator.isAlphaSpace).toBe('function')
  })

  it('should export function isAlphaUnderscore()', () => {
    expect(typeof validator.isAlphaUnderscore).toBe('function')
  })

  it('should export function isLowerAlphaUnderscore()', () => {
    expect(typeof validator.isLowerAlphaUnderscore).toBe('function')
  })

  it('should export function isDigit()', () => {
    expect(typeof validator.isDigit).toBe('function')
  })

  it('should export function isAlphaNumeric()', () => {
    expect(typeof validator.isAlphaNumeric).toBe('function')
  })

  it('should export function isAlphaNumericSpace()', () => {
    expect(typeof validator.isAlphaNumericSpace).toBe('function')
  })

  it('should export function isAlphaNumericSpaceWithSpecialCharacter()', () => {
    expect(typeof validator.isAlphaNumericSpaceAndSpecialCharacter).toBe('function')
  })

  it('should export function isDate()', () => {
    expect(typeof validator.isDate).toBe('function')
  })

  it('should export function isTime()', () => {
    expect(typeof validator.isTime).toBe('function')
  })

  it('should export function isUuid()', () => {
    expect(typeof validator.isUuid).toBe('function')
  })

  it('should export function isInt()', () => {
    expect(typeof validator.isInt).toBe('function')
  })

  it('should export function isFloat()', () => {
    expect(typeof validator.isFloat).toBe('function')
  })

  it('should export function isPhone()', () => {
    expect(typeof validator.isPhone).toBe('function')
  })

  it('should export function isEmail()', () => {
    expect(typeof validator.isEmail).toBe('function')
  })

  it('should export function isUrl()', () => {
    expect(typeof validator.isUrl).toBe('function')
  })

  it('should export function isJson()', () => {
    expect(typeof validator.isJson).toBe('function')
  })

  it('should export function object()', () => {
    expect(typeof validator.object).toBe('function')
  })

  it('should export function each()', () => {
    expect(typeof validator.each).toBe('function')
  })

  it('should export function when()', () => {
    expect(typeof validator.when).toBe('function')
  })

  it('should export function equalTo()', () => {
    expect(typeof validator.equalTo).toBe('function')
  })

})
