import { createString, createBoolean, createNumber, createArray, createObject, createTuple } from './schema'

describe('Schema builder', () => {
  describe('createString', () => {
    it('should be Type contructor', () => {
      const string   = createString()
      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = string({}, resolver)

      expect(typeof string).toBe('function')
      expect(resolver).toBeCalledWith({ type: 'string' })
      expect(result).toBe('lorem')
    })
  })

  describe('createNumber', () => {
    it('should be Type contructor', () => {
      const type     = createNumber()
      const resolver = jest.fn().mockReturnValue(123)
      const result   = type({}, resolver)

      expect(typeof type).toBe('function')
      expect(resolver).toBeCalledWith({ type: 'number' })
      expect(result).toBe(123)
    })
  })

  describe('createBoolean', () => {
    it('should be Type contructor', () => {
      const type     = createBoolean()
      const resolver = jest.fn().mockReturnValue(true)
      const result   = type({}, resolver)

      expect(typeof type).toBe('function')
      expect(resolver).toBeCalledWith({ type: 'boolean' })
      expect(result).toBe(true)
    })
  })

  describe('createNumber', () => {
    it('should be Type contructor', () => {
      const resolver = jest.fn()
        .mockReturnValueOnce(123)
        .mockReturnValueOnce('lorem')
        .mockReturnValueOnce(true)

      const type   = createTuple(createNumber(), createString(), createBoolean())
      const result = type({}, resolver)

      expect(typeof type).toBe('function')
      expect(resolver).toHaveBeenNthCalledWith(1, { type: 'number' })
      expect(resolver).toHaveBeenNthCalledWith(2, { type: 'string' })
      expect(resolver).toHaveBeenNthCalledWith(3, { type: 'boolean' })
      expect(result).toStrictEqual([123, 'lorem', true])
    })
  })

  describe('createArray', () => {
    it('should be Type contructor', () => {
      const type     = createArray(createString(), 3)
      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(typeof type).toBe('function')
      expect(resolver).toBeCalledWith({ type: 'string' })
      expect(resolver).toBeCalledTimes(3)
      expect(result).toStrictEqual(['lorem', 'lorem', 'lorem'])
    })

    it('should be deeply resolving type', () => {
      const type     = createArray(createArray(createArray(createString(), 2), 2), 2)
      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)
      const expected = [
        [
          ['lorem', 'lorem'],
          ['lorem', 'lorem'],
        ],
        [
          ['lorem', 'lorem'],
          ['lorem', 'lorem'],
        ]
      ]

      expect(result).toStrictEqual(expected)
      expect(resolver).toBeCalledTimes(2 * 2 * 2)
      expect(result.flat(3).length).toBe(2 * 2 * 2)
    })

    it('should be generate 10 items if length not set', () => {
      const type     = createArray(createString())
      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(result.length).toBe(10)
    })
  })

  describe('createObject', () => {
    it('should be Type contructor', () => {
      const type = createObject({
        id  : createString(),
        name: createString(),
      })

      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(typeof type).toBe('function')
      expect(resolver).toBeCalledTimes(2)
      expect(result).toStrictEqual({
        id  : 'lorem',
        name: 'lorem',
      })
    })

    it('should be send object\'s key as "name"', () => {
      const type = createObject({
        id  : createString(),
        name: createString(),
      })

      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(resolver).toBeCalledTimes(2)
      expect(resolver).toHaveBeenNthCalledWith(1, { type: 'string', name: 'id' })
      expect(resolver).toHaveBeenNthCalledWith(2, { type: 'string', name: 'name' })
      expect(result).toStrictEqual({
        id  : 'lorem',
        name: 'lorem',
      })
    })

    it('should be send modelName if set', () => {
      const type = createObject({
        id  : createString(),
        name: createString(),
      }, 'UserModel')

      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(resolver).toBeCalledTimes(2)
      expect(resolver).toHaveBeenNthCalledWith(1, { type: 'string', name: 'id', modelName: 'UserModel' })
      expect(resolver).toHaveBeenNthCalledWith(2, { type: 'string', name: 'name', modelName: 'UserModel' })
      expect(result).toStrictEqual({
        id  : 'lorem',
        name: 'lorem',
      })
    })

    it('should be send object\'s key as modelName to child object', () => {
      const type = createObject({
        id    : createString(),
        name  : createString(),
        member: createObject({ id: createString() }),
      }, 'UserModel')

      const resolver = jest.fn().mockReturnValue('lorem')
      const result   = type({}, resolver)

      expect(resolver).toBeCalledTimes(3)
      expect(resolver).toHaveBeenNthCalledWith(1, { type: 'string', name: 'id', modelName: 'UserModel' })
      expect(resolver).toHaveBeenNthCalledWith(2, { type: 'string', name: 'name', modelName: 'UserModel' })
      expect(resolver).toHaveBeenNthCalledWith(3, { type: 'string', name: 'id', modelName: 'member' })
      expect(result).toStrictEqual({
        id    : 'lorem',
        name  : 'lorem',
        member: { id: 'lorem' },
      })
    })
  })
})
