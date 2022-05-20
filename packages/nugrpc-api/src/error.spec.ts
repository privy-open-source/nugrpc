import Axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { useApi } from "."
import { getCode, getMessage, isApiError } from "./error"

let mock: MockAdapter

beforeAll(() => {
  mock = new MockAdapter(Axios)
})

afterEach(() => {
  mock.reset()
})

describe('Error utils', () => {
  describe('getCode', () => {
    it('should be able to get error code with getCode()', async () => {
      mock.onGet('/api/user').reply(422, {
        code   : 422,
        message: 'Validation Error',
        details: [],
      })

      const api = useApi()

      try {
        await api.get('/api/user')
      } catch (error) {
        const code = getCode(error)

        expect(code).toBe(422)
      }
    })

    it('should return 500 if error not an api error', () => {
      const error = new Error('Hehe')
      const code  = getCode(error)

      expect(code).toBe(500)
    })
  })

  describe('getMessage', () => {
    it('should return error message in response body if present', async () => {
      mock.onGet('/api/user').reply(422, {
        code   : 422,
        message: 'Validation Error',
        details: [],
      })

      const api = useApi()

      try {
        await api.get('/api/user')
      } catch (error) {
        const message = getMessage(error)

        expect(message).toBe('Validation Error')
      }
    })

    it('should return error message in if response body has no error\'s message', async () => {
      mock.onGet('/api/user').reply(422, {
        code   : 422,
        details: [],
      })

      const api = useApi()

      try {
        await api.get('/api/user')
      } catch (error) {
        const message = getMessage(error)

        expect(message).toBe('Request failed with status code 422')
      }
    })

    it('should return error message even if error not an api error', async () => {
      const error   = new Error('Hehe')
      const message = getMessage(error)

      expect(message).toBe('Hehe')
    })
  })

  describe('isApiError()', () => {
    it('should be able to check error is ApiError or not with isApiError()', async () => {
      mock.onGet('/api/invalid').reply(500, 'Internal Server Error')
      mock.onGet('/api/user').reply(422, {
        code   : 422,
        message: 'Validation Error',
        details: [
          {
            type_url: 'type_url',
            value   : 'base64string',
          }
        ],
      })

      const api          = useApi()
      const normalError  = new Error('Not Error')
      const resposeError = await (api.get('/api/not-found').catch((error) => error))
      const grpcError    = await (api.get('/api/user').catch((error) => error))

      expect(isApiError(normalError)).toBe(false)
      expect(isApiError(resposeError)).toBe(false)
      expect(isApiError(grpcError)).toBe(true)
    })
  })
})
