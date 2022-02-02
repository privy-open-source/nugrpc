import { Fackery, isMatch, Rule } from '.'
import s from './schema'

describe('Fackery', () => {
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

  describe('Fackery', () => {
    const mockPreset: Rule[] = [
      { type: 'string', name: /name$/, modelName: /doc/i, handler: () => 'Document Title' },
      { type: 'string', name: /_?id$/, handler: () => 'uuid' },
      { type: 'string', name: /name$/, handler: () => 'Tarjono Smith' },
      { type: 'string', handler: () => 'lorem ipsum' },
      { type: 'number', handler: () => 123456 },
      { type: 'boolean', handler: () => true },
    ]

    it('should be create an object with values based on preset', () => {
      const fackery = new Fackery({ presets: mockPreset })
      const schema  = s.object({
        id      : s.string(),
        name    : s.string(),
        other   : s.string(),
        balance : s.number(),
        isActive: s.boolean(),
      })

      const output   = fackery.create(schema)
      const expected = {
        id      : 'uuid',
        name    : 'Tarjono Smith',
        other   : 'lorem ipsum',
        balance : 123456,
        isActive: true,
      }

      expect(output).toStrictEqual(expected)
    })
  })
})
