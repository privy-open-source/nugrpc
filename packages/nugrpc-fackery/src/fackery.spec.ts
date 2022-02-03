import { Fackery } from './fackery'
import { Presets } from './rules'
import s from './schema'

describe('Fackery', () => {
  const mockPreset: Presets = [
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

  it('should be use cache. instead of scaning from presets', () => {
    const fackery = new Fackery({ presets: mockPreset })
    const schema  = s.array(s.object({ name: s.string() }), 5)

    /* @ts-expect-error */
    const findHandler = jest.spyOn(fackery, 'findHandler')

    const output   = fackery.create(schema)
    const expected = [
      { name: 'Tarjono Smith' },
      { name: 'Tarjono Smith' },
      { name: 'Tarjono Smith' },
      { name: 'Tarjono Smith' },
      { name: 'Tarjono Smith' },
    ]

    expect(output).toStrictEqual(expected)
    expect(findHandler).toBeCalledTimes(1)
  })

  it('should thrown an error if can not find any handler of type', () => {
    expect(() => {
      const fackery = new Fackery({ presets: [] })
      const schema  = s.string()

      fackery.create(schema)
    }).toThrow('Cannot resolve type "string"')
  })
})
