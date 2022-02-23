import { normalizeCondition } from './normalizer'

describe('normalizeCondition', () => {
  it('should be able to tranform logical syntax into js logical syntax', () => {
    const input    = '(item !== "name" || !email) && version > 2'
    const expected = '({ version, item, email }) => (item !== "name" || !email) && version > 2'
    const output   = normalizeCondition(input)

    expect(output).toEqual(expected)
  })
})
