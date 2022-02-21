import { each } from "./each"
import { object } from "./object"
import { maxValue } from "./value"

describe('each (repeat)', () => {
  it('should run validation for each items in array', () => {
    const rule      = maxValue(5)
    const spy       = jest.spyOn(rule, 'validate')
    const validator = each([rule])

    validator.validate([5, 6, 7])

    expect(spy).toBeCalledTimes(3)
    expect(spy).nthCalledWith(1, 5, {})
    expect(spy).nthCalledWith(2, 6, {})
    expect(spy).nthCalledWith(3, 7, {})
  })

  it('should return true if all items is satisfying the rule', () => {
    const validator = each(object({
      id: [maxValue(5)]
    }))

    const result = validator.validate([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    expect(result.$valid).toBe(true)
  })

  it('should return false if one of items is not satisfying the rule', () => {
    const validator = each(object({
      id: [maxValue(5)]
    }))

    const result = validator.validate([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 7 },
    ])

    expect(result.$valid).toBe(false)
  })

  it('should return an array as a result', () => {
    const validator = each(object({
      id: [maxValue(5)]
    }))

    const result = validator.validate([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 7 },
    ])

    expect(Array.isArray(result)).toBe(true)
    expect(result[3].id.$valid).toBe(false)
  })
})

describe('each with minValue', () => {
  it('should return false if input items less than minValue even all items is satisfying', () => {
    const validator = each(object({
      id: [maxValue(5)]
    })).minLength(5)

    const result = validator.validate([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    expect(result.$valid).toBe(false)
  })
})

describe('each with minValue', () => {
  it('should return false if input items greater than maxValue even all items is satisfying', () => {
    const validator = each(object({
      id: [maxValue(5)]
    })).maxLength(2)

    const result = validator.validate([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ])

    expect(result.$valid).toBe(false)
  })
})
