import { Value } from ".."
import {
  isAlpha,
  isAlphaNumeric,
  isAlphaNumericSpace,
  isAlphaNumericSpaceAndSpecialCharacter,
  isAlphaSpace,
  isAlphaUnderscore,
  isDate,
  isDigit,
  isEmail,
  isFloat,
  isInt,
  isJson,
  isLowerAlphaUnderscore,
  isPhone,
  isTime,
  isUuid,
  isUrl,
} from "./is"

describe('isAlpha', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', true ],
    ['abcd    ', true ],
    ['  abcd  ', true ],
    ['    abcd', true ],
    ['qwerty12', false],
    ['12345678', false],
    ['   abc12', false],
    ['abc12   ', false],
    ['qwery 12', false],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       false],
    [1e6,        false],
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
    const validator = isAlpha()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isAlphaSpace', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', true ],
    ['abcd    ', true ],
    ['  abcd  ', true ],
    ['    abcd', true ],
    ['foo bar ', true ],
    ['qwerty12', false],
    ['12345678', false],
    ['   abc12', false],
    ['abc12   ', false],
    ['qwery 12', false],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       false],
    [1e6,        false],
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
    const validator = isAlphaSpace()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isAlphaUnderscore', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', true ],
    ['abcd    ', true ],
    ['  abcd  ', true ],
    ['    abcd', true ],
    ['foo_bar ', true ],
    ['foo bar ', false],
    ['foo-bar ', false],
    ['qwerty12', false],
    ['12345678', false],
    ['   abc12', false],
    ['abc12   ', false],
    ['qwery 12', false],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       false],
    [1e6,        false],
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
    const validator = isAlphaUnderscore()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isLowerAlphaUnderscore', () => {
  const cases: [Value, boolean][] = [
    ['ABCdefgh', false],
    ['abcd    ', true ],
    ['  abcd  ', true ],
    ['    abcd', true ],
    ['foo_bar ', true ],
    ['FOO_BAR ', false],
    ['foo bar ', false],
    ['foo-bar ', false],
    ['qwerty12', false],
    ['12345678', false],
    ['   abc12', false],
    ['abc12   ', false],
    ['qwery 12', false],
    ['qwery-12', false],
    ['qwery-12', false],
    [1233,       false],
    [1e6,        false],
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
    const validator = isLowerAlphaUnderscore()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

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

describe('isAlphaNumericSpace', () => {
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

describe('isDigit', () => {
  const cases: [Value, boolean][] = [
    ['12345678',    true],
    ['00000000',    true],
    ['ABCdefgh',    false],
    ['   abc12',    false],
    ['abc12   ',    false],
    ['qwerty12',    false],
    ['qwerty 12',   false],
    ['qwerty+12',   false],
    ['qwerty_12',   false],
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
    const validator = isDigit()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isDate', () => {
  const cases: [Value, boolean][] = [
    [new Date(),                      true],
    ['2019-01-01',                    true],
    ['2019-01-01T00:00:00.000Z',      true],
    ['2019-01-01T00:00:00',           true],
    ['01 Oct 22',                     false],
    ['Aug 9, 1995',                   false],
    ['Wed, 09 Aug 1995 00:00:00 GMT', false],
    ['01 Oct 2022',                   false],
    ['true',                          false],
    ['false',                         false],
    ['ABCdefgh',                      false],
    ['   abc12',                      false],
    ['abc12   ',                      false],
    ['qwerty12',                      false],
    ['qwerty 12',                     false],
    ['qwerty+12',                     false],
    ['qwerty_12',                     false],
    ['qwerty-12',                     false],
    ['e@mail+com',                    false],
    [1233,                            false],
    [1e6,                             false],
    [NaN,                             false],
    [Infinity,                        false],
    [{},                              false],
    [null,                            false],
    [true,                            false],
    [false,                           false],
    [undefined,                       false],
    [['12346'],                       false],
    [{ id: 1 },                       false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isDate()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isTime', () => {
  const cases: [Value, boolean][] = [
    [new Date(),                      true],
    ['02:11',                         true],
    ['02:11:59',                      true],
    ['02:70',                         false],
    ['02:10:70',                      false],
    ['24:10:70',                      false],
    ['2019-01-01',                    false],
    ['2019-01-01T00:00:00.000Z',      false],
    ['2019-01-01T00:00:00',           false],
    ['01 Oct 22',                     false],
    ['Aug 9, 1995',                   false],
    ['Wed, 09 Aug 1995 00:00:00 GMT', false],
    ['01 Oct 2022',                   false],
    ['true',                          false],
    ['false',                         false],
    ['ABCdefgh',                      false],
    ['   abc12',                      false],
    ['abc12   ',                      false],
    ['qwerty12',                      false],
    ['qwerty 12',                     false],
    ['qwerty+12',                     false],
    ['qwerty_12',                     false],
    ['qwerty-12',                     false],
    ['e@mail+com',                    false],
    [1233,                            false],
    [1e6,                             false],
    [NaN,                             false],
    [Infinity,                        false],
    [{},                              false],
    [null,                            false],
    [true,                            false],
    [false,                           false],
    [undefined,                       false],
    [['12346'],                       false],
    [{ id: 1 },                       false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isTime()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isUuid', () => {
  const cases: [Value, boolean][] = [
    ['5fabed2c-92be-11ec-b909-0242ac120002', true],
    ['5fabed2c-92be-11ec-b909', false],
    ['5fabed2c-92be-11ec', false],
    ['5fabed2c-92be', false],
    ['5fabed2c',    false],
    ['ABCdefgh',    false],
    ['true',        false],
    ['false',       false],
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
    const validator = isUuid()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isEmail', () => {
  const cases: [Value, boolean][] = [
    ['e@mail.com',  true],
    ['mail@mail.adenovid.id',  true],
    ['mail@gmail.com',  true],
    ['ABCdefgh',    false],
    ['true',        false],
    ['false',       false],
    ['ABCdefgh',    false],
    ['   abc12',    false],
    ['abc12   ',    false],
    ['qwerty12',    false],
    ['qwerty 12',   false],
    ['qwerty+12',   false],
    ['qwerty_12',   false],
    ['qwerty-12',   false],
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
    const validator = isEmail()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isPhone', () => {
  const cases: [Value, boolean][] = [
    ['081123456789',    true],
    ['6281123456789',   true],
    ['+6281123456789',  true],
    ['ABCdefgh',        false],
    ['true',            false],
    ['false',           false],
    ['ABCdefgh',        false],
    ['   abc12',        false],
    ['abc12   ',        false],
    ['qwerty12',        false],
    ['qwerty 12',       false],
    ['qwerty+12',       false],
    ['qwerty_12',       false],
    ['qwerty-12',       false],
    [1233,              false],
    [1e6,               false],
    [NaN,               false],
    [Infinity,          false],
    [{},                false],
    [null,              false],
    [true,              false],
    [false,             false],
    [undefined,         false],
    [['12346'],         false],
    [{ id: 1 },         false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isPhone('id-ID')
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isJson', () => {
  const cases: [Value, boolean][] = [
    ['{"id":123} ', true],
    ['12345678',    false],
    ['"ABCdefgh"',  false],
    ['true',        false],
    ['false',       false],
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

describe('isInt', () => {
  const cases: [Value, boolean][] = [
    ['12331',                         true],
    ['123.12',                        false],
    ['true',                          false],
    ['false',                         false],
    ['ABCdefgh',                      false],
    ['   abc12',                      false],
    ['abc12   ',                      false],
    ['qwerty12',                      false],
    ['qwerty 12',                     false],
    ['qwerty+12',                     false],
    ['qwerty_12',                     false],
    ['qwerty-12',                     false],
    ['e@mail+com',                    false],
    [1233,                            true],
    [1e6,                             true],
    [1.25555,                         false],
    [NaN,                             false],
    [Infinity,                        false],
    [{},                              false],
    [null,                            false],
    [true,                            false],
    [false,                           false],
    [undefined,                       false],
    [['12346'],                       false],
    [{ id: 1 },                       false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isInt()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isFloat', () => {
  const cases: [Value, boolean][] = [
    ['12331',                         true],
    ['123.12',                        true],
    ['true',                          false],
    ['false',                         false],
    ['ABCdefgh',                      false],
    ['   abc12',                      false],
    ['abc12   ',                      false],
    ['qwerty12',                      false],
    ['qwerty 12',                     false],
    ['qwerty+12',                     false],
    ['qwerty_12',                     false],
    ['qwerty-12',                     false],
    ['e@mail+com',                    false],
    [1233,                            true],
    [1e6,                             true],
    [1.25555,                         true],
    [NaN,                             false],
    [Infinity,                        false],
    [{},                              false],
    [null,                            false],
    [true,                            false],
    [false,                           false],
    [undefined,                       false],
    [['12346'],                       false],
    [{ id: 1 },                       false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isFloat()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

describe('isUrl', () => {
  const cases: [Value, boolean][] = [
    ['http://www.example.com',        true],
    ['www.example.com',               true],
    ['www.example.com/path',          true],
    ['www.example.com/path?query=1',  true],
    ['e@mail+com',                    false],
    [1233,                            false],
    [1e6,                             false],
    [1.25555,                         false],
    [NaN,                             false],
    [Infinity,                        false],
    [{},                              false],
    [null,                            false],
    [true,                            false],
    [false,                           false],
    [undefined,                       false],
    [['12346'],                       false],
    [{ id: 1 },                       false],
  ]

  it.each(cases)('%s should return %s', (value, expected) => {
    const validator = isUrl()
    const result    = validator.validate(value)

    expect(result.$valid).toBe(expected)
  })
})

