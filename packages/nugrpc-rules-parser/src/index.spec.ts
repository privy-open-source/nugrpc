import { isValid, splitBy, Rule, parse } from "."

describe('Comment Parser', () => {
  describe('IsValid', () => {
    const testcases: Array<[string, boolean]> = [
      // Valid
      ['@Rules: Match(/[A-Z]{2}[0-9]{4-6}/gi)', true],
      ['@Rules: Required', true],
      ['@Rules: Required()', true],
      ['@Rules: Required | In(5, 10, 15)', true],
      ['@Rules: Required | Min(1) | Max(5)', true],
      ['@rules: required | is-alpha-space | is-uuid', true],
      ['@rules: required | isAlphaNumeric', true],
      ['@rules: min(5) | between(5, 3, 5)', true],
      ['@rules: match(/HelloWorld/)', true],
      ['@rules: required|isAlphaNumeric', true],
      ['@rules: maxLength (52)', true],
      ['@rules: when (enterpriseId == "enterprise", required | isEmail)', true],
      // Shortcut
      ['@required', true],
      ['@Optional', true],
      // Invalid
      ['@rules:', false],
      ['@rules', false],
      ['@Rules: | Required', false],
      ['@Rules: Required |', false],
      ['@rules: required is-nik', false],
      ['@rules: required, isAlphaSpace', false],
      ['@rules: |require | isAlphaSpace', false],
      ['@min', false],
    ]

    it.each(testcases)('comment "%s" should be "%s"', (input, expected) => {
      expect(isValid(input)).toBe(expected)
    })
  })

  describe('splitBy', () => {
    it('Should be spliting string by delimiter', () => {
      const input     = 'required | is-alpha-space | is-uuid'
      const delimiter = '|'
      const expected  = ['required', 'is-alpha-space', 'is-uuid']
      const result    = splitBy(input, delimiter)

      expect(result).toStrictEqual(expected)
    })

    it('Should be return single item if delimiter not exist in input string', () => {
      const input     = 'required'
      const delimiter = '|'
      const expected  = ['required']
      const result    = splitBy(input, delimiter)

      expect(result.length).toBe(1)
      expect(result).toStrictEqual(expected)
    })

    it('Should not split delimiter inside regex', () => {
      const input     = 'required | match(/(foo|bar)/)'
      const delimiter = '|'
      const expected  = ['required', 'match(/(foo|bar)/)']
      const result    = splitBy(input, delimiter)

      expect(result).toStrictEqual(expected)
    })

    it('Should not split delimiter inside quote', () => {
      const input     = 'required | match("foo|bar")'
      const delimiter = '|'
      const expected  = ['required', 'match("foo|bar")']
      const result    = splitBy(input, delimiter)

      expect(result).toStrictEqual(expected)
    })

    it('Should not split escaped char', () => {
      const input     = 'required \\| match("foo|bar")'
      const delimiter = '|'
      const expected  = ['required \\| match("foo|bar")']
      const result    = splitBy(input, delimiter)

      expect(result).toStrictEqual(expected)
    })
  })

  describe('parse', () => {
    it('Can parsing single rule', () => {
      const input: string    = '@Rules: Required'
      const result           = parse(input)
      const expected: Rule[] = [{
        name   : 'Required',
        options: [],
      }]

      expect(result).toStrictEqual(expected)
    })

    it('Can parsing single rule with empty params', () => {
      const input: string    = '@Rules: Required()'
      const result           = parse(input)
      const expected: Rule[] = [{
        name   : 'Required',
        options: [],
      }]

      expect(result).toStrictEqual(expected)
    })

    it('Can parsing rule with params', () => {
      const input: string    = '@Rules: In("asc", "desc")'
      const result           = parse(input)
      const expected: Rule[] = [{
        name   : 'In',
        options: ['"asc"', '"desc"'],
      }]

      expect(result).toStrictEqual(expected)
    })

    it('Can parsing multiple rules', () => {
      const input: string    = '@Rules: required | In("asc", "desc")'
      const result           = parse(input)
      const expected: Rule[] = [
        {
          name   : 'Required',
          options: [],
        },
        {
          name   : 'In',
          options: ['"asc"', '"desc"'],
        },
      ]

      expect(result).toStrictEqual(expected)
    })

    it('Can parsing shortcut rules', () => {
      const input: string    = '@required'
      const result           = parse(input)
      const expected: Rule[] = [
        {
          name   : 'Required',
          options: [],
        },
      ]

      expect(result).toStrictEqual(expected)
    })

    it('Can parsing sub rule inside "when" parameter', () => {
      const input: string    = '@rules: when (enterpriseId == "enterprise", required | isEmail | between(5, 10))'
      const result           = parse(input)
      const expected: Rule[] = [
        {
          name      : 'When',
          options: [
            'enterpriseId == "enterprise"',
            [
              {
                name   : 'Required',
                options: [],
              },
              {
                name   : 'IsEmail',
                options: [],
              },
              {
                name   : 'Between',
                options: ['5', '10'],
              },
            ]
          ],
        },
      ]

      expect(result).toStrictEqual(expected)
    })

    it('Should be tranform kebab-case and camelCase into PascalCase', () => {
      const input: string    = '@Rules: required | is-alpha-space | isUuid'
      const result           = parse(input)
      const expected: Rule[] = [
        {
          name   : 'Required',
          options: [],
        },
        {
          name   : 'IsAlphaSpace',
          options: [],
        },
        {
          name   : 'IsUuid',
          options: [],
        },
      ]

      expect(result).toStrictEqual(expected)
    })

    it('Should be return nothing if syntax invalid', () => {
      const input: string    = '@Rules: | Required'
      const result           = parse(input)
      const expected: Rule[] = []

      expect(result).toStrictEqual(expected)
    })
  })
})
