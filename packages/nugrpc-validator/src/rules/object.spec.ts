import { Validator } from '../rule'
import { object } from './object'

const mockValidator = (): Validator => {
  return {
    validate: jest.fn(() => {
      return {
        $valid  : true,
        $message: '',
      }
    })
  }
}

describe('object', () => {
  describe('.validate()', () => {
    it('should be able to validate every key in object', () => {
      const rule      = mockValidator()
      const validator = object({
        id    : [rule],
        name  : [rule],
        active: [rule],
      })

      const input = {
        id    : 1,
        name  : 'Tarjono',
        active: true,
      }

      validator.validate(input)

      expect(rule.validate).toBeCalledTimes(3)
      expect(rule.validate).toHaveBeenNthCalledWith(1, 1, input)
      expect(rule.validate).toHaveBeenNthCalledWith(2, 'Tarjono', input)
      expect(rule.validate).toHaveBeenNthCalledWith(3, true, input)
    })

    it('should be able to validate every key in object', () => {
      const rule      = mockValidator()
      const validator = object({
        id    : [],
        name  : [],
        active: [],
        member: object({
          id: [rule]
        })
      })

      const input = {
        id    : 1,
        name  : 'Tarjono',
        active: true,
      }

      validator.validate(input)

      expect(rule.validate).toHaveBeenCalled()
    })

    it('should be able to validate even input object is missing some key', () => {
      const rule      = mockValidator()
      const validator = object({
        id    : [rule],
        name  : [rule],
        active: [rule],
      })

      const input = {}

      validator.validate(input)

      expect(rule.validate).toBeCalledTimes(3)
      expect(rule.validate).toHaveBeenNthCalledWith(1, undefined, input)
      expect(rule.validate).toHaveBeenNthCalledWith(2, undefined, input)
      expect(rule.validate).toHaveBeenNthCalledWith(3, undefined, input)
    })
  })

  describe('.validateOnly()', () => {
    it('should be validate only some key would defined', () => {
      const rule      = mockValidator()
      const validator = object({
        id    : [rule],
        name  : [rule],
        active: [rule],
      })

      const input = {
        id    : 1,
        name  : 'Tarjono',
        active: true,
      }

      validator.validateOnly(['name', 'active'], input)

      expect(rule.validate).toBeCalledTimes(2)
      expect(rule.validate).toHaveBeenNthCalledWith(1, 'Tarjono', input)
      expect(rule.validate).toHaveBeenNthCalledWith(2, true, input)
    })
  })
})
