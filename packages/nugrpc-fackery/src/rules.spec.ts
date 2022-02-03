import { isMatch, Rule, sortRules } from "./rules"

describe('isMatch', () => {
  it('could compare string with regext', () => {
    const text   = 'username'
    const output = isMatch(text, /name$/)

    expect(output).toBe(true)
  })

  it('could compare string with callback', () => {
    const text     = 'username'
    const callback = jest.fn((name) => name.endsWith('name'))
    const output   = isMatch(text, callback)

    expect(output).toBe(true)
    expect(callback).toBeCalledWith(text)
  })

  it('could compare string with array of string', () => {
    const text   = 'username'
    const output = isMatch(text, ['name', 'firstname', 'username'])

    expect(output).toBe(true)
  })

  it('could compare string with string', () => {
    const text   = 'username'
    const output = isMatch(text, 'username')

    expect(output).toBe(true)
  })
})

describe('sortRules', () => {
  type SortRule = Rule & { _id: number }

  it('could sorting rules from most specific to less specific', () => {
    const input: SortRule[] = [
      { _id: 1, type: 'string', handler: () => '' },
      { _id: 2, type: 'string', name: 'id', modelName: 'user', handler: () => '' },
      { _id: 3, type: 'string', name: 'id', handler: () => '' },
      { _id: 4, type: 'string', modelName: 'user', handler: () => '' },
    ]

    const result = sortRules(input) as SortRule[]

    const expected: SortRule[] = [
      { _id: 2, type: 'string', name: 'id', modelName: 'user', handler: () => '' },
      { _id: 4, type: 'string', modelName: 'user', handler: () => '' },
      { _id: 3, type: 'string', name: 'id', handler: () => '' },
      { _id: 1, type: 'string', handler: () => '' },
    ]

    expect(result.map(i => i._id)).toStrictEqual(expected.map(i => i._id))
  })

  it('could sorting rules from less flexible to most flexible', () => {
    const input: SortRule[] = [
      { _id: 1, type: 'string', name: /_id$/i, handler: () => ''  },
      { _id: 2, type: 'string', name: ['id', 'user_id'], handler: () => '' },
      { _id: 3, type: 'string', name: 'id', handler: () => '' },
      { _id: 4, type: 'string', name: (name) => name.startsWith('id'), handler: () => '' },
    ]

    const result = sortRules(input) as SortRule[]

    const expected: SortRule[] = [
      { _id: 3, type: 'string', name: 'id', handler: () => '' },
      { _id: 2, type: 'string', name: ['id', 'user_id'], handler: () => '' },
      { _id: 1, type: 'string', name: /_id$/i, handler: () => ''  },
      { _id: 4, type: 'string', name: (name) => name.startsWith('id'), handler: () => '' },
    ]

    expect(result.map(i => i._id)).toStrictEqual(expected.map(i => i._id))
  })

  it('should be keep as is if priorities is same', () => {
    const input: SortRule[] = [
      { _id: 1, type: 'string', handler: () => '' },
      { _id: 2, type: 'number', handler: () => 1 },
      { _id: 3, type: 'string', name: 'phone', handler: () => '' },
      { _id: 4, type: 'boolean', handler: () => true },
      { _id: 5, type: 'string', name: 'email', handler: () => '' },
    ]

    const result = sortRules(input) as SortRule[]

    const expected: SortRule[] = [
      { _id: 3, type: 'string', name: 'phone', handler: () => '' },
      { _id: 5, type: 'string', name: 'email', handler: () => '' },
      { _id: 1, type: 'string', handler: () => '' },
      { _id: 2, type: 'number', handler: () => 1 },
      { _id: 4, type: 'boolean', handler: () => true },
    ]

    expect(result.map(i => i._id)).toStrictEqual(expected.map(i => i._id))
  })
})
