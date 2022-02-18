import { Value } from ".."
import {
  isAlphaNumeric,
  isAlphaNumericSpace,
  isAlphaNumericSpaceAndSpecialCharacter,
  isJson,
} from "./is"

describe('isAlphaNumeric', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', true ],
    ['12345678', true ],
    ['qwerty12', true ],
    ['   abc12', true ],
    ['abc12   ', true ],
    ['qwery 12', false],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       true ],
    [1e6,        true ],
    [NaN,        false],
    [Infinity,   false],
    [{},         false],
    [null,       false],
    [true,       false],
    [false,      false],
    [undefined,  false],
    [['12346'],  false],
    [{ id: 1 },  false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isAlphaNumeric()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isAlphaNumeric', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', true],
    ['12345678', true],
    ['   abc12', true],
    ['abc12   ', true],
    ['qwerty12', true],
    ['qwery 12', true],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       true],
    [1e6,        true],
    [NaN,        false],
    [Infinity,   false],
    [{},         false],
    [null,       false],
    [true,       false],
    [false,      false],
    [undefined,  false],
    [['12346'],  false],
    [{ id: 1 },  false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isAlphaNumericSpace()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isAlphaNumericSpaceAndSpecialCharacter', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh',    true],
    ['12345678',    true],
    ['   abc12',    true],
    ['abc12   ',    true],
    ['qwerty12',    true],
    ['qwerty 12',   true],
    ['qwerty+12',   true],
    ['qwerty_12',   true],
    ['qwerty-12',   false],
    ['e@mail+com',  false],
    [1233,          true],
    [1e6,           true],
    [NaN,           false],
    [Infinity,      false],
    [{},            false],
    [null,          false],
    [true,          false],
    [false,         false],
    [undefined,     false],
    [['12346'],     false],
    [{ id: 1 },     false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isAlphaNumericSpaceAndSpecialCharacter()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isJson', () => {
  const cases: [Value, boolean][] = [
    ['{"id":123} ', true],
    ['12345678',    true],
    ['"ABCdefgh"',  true],
    ['true',        true],
    ['false',       true],
    ['ABCdefgh',    false],
    ['   abc12',    false],
    ['abc12   ',    false],
    ['qwerty12',    false],
    ['qwerty 12',   false],
    ['qwerty+12',   false],
    ['qwerty_12',   false],
    ['qwerty-12',   false],
    ['e@mail+com',  false],
    [1233,          false],
    [1e6,           false],
    [NaN,           false],
    [Infinity,      false],
    [{},            false],
    [null,          false],
    [true,          false],
    [false,         false],
    [undefined,     false],
    [['12346'],     false],
    [{ id: 1 },     false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isJson()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})
