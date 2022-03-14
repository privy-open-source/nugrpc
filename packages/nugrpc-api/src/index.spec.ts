import Axios, { AxiosResponse } from "axios"
import MockAdapter from "axios-mock-adapter"
import { jest }from "@jest/globals"
import {
  createApi,
  onError,
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
  removeHook,
  resetHook,
  setApi,
  useApi,
} from "."

let mock: MockAdapter

beforeAll(() => {
  mock = new MockAdapter(Axios)
})

afterEach(() => {
  mock.reset()
})

describe('useApi', () => {
  it('should return same instance and same instance (singleton)', () => {
    const a = useApi()
    const b = useApi()

    expect(a).toStrictEqual(b)
  })
})

describe('setApi', () => {
  it('should be able to replace global instance', () => {
    const old   = useApi()
    const fresh = createApi()

    setApi(fresh)

    const last = useApi()

    expect(last).toStrictEqual(fresh)
    expect(last).not.toStrictEqual(old)
  })
})

describe('Hooks utils', () => {
  it('should be able to registering on-request hook using onRequest()', async () => {
    mock.onGet('/api/user').reply(200, [])

    const api      = useApi()
    const fn       = jest.fn((config) => config)
    const config   = { headers: { foo: 'bar' }}
    const expected = expect.objectContaining({
      headers: expect.objectContaining({
        foo: 'bar'
      })
    })

    onRequest(fn)

    await api.get('/api/user', config)

    expect(fn).toBeCalled()
    expect(fn).toBeCalledWith(expected)
  })

  it('should be able to registering on-response hook using onResponse()', async () => {
    mock.onGet('/api/user').reply(200, { foo: 'bar' })

    const api      = useApi()
    const fn       = jest.fn((response: AxiosResponse) => response)
    const expected = expect.objectContaining({
      data: { foo: 'bar' }
    })

    onResponse(fn)

    await api.get('/api/user')

    expect(fn).toBeCalled()
    expect(fn).toBeCalledWith(expected)
  })

  it('should be able to registering on-request-error hook using onRequestError()', async () => {
    const api = useApi()
    const fn  = jest.fn((error) => Promise.reject(error))

    onRequestError(fn)

    // mock request error
    onRequest(jest.fn().mockRejectedValue('Hehe'))

    try {
      await api.get('/api/user')
    } catch {
      expect(fn).toBeCalled()
      expect(fn).toBeCalledWith('Hehe')
    }
  })

  it('should be able to registering on-response-error hook using onResponseError()', async () => {
    mock.onGet('/api/user').reply(422, {
      code   : 422,
      message: 'Validation Error',
      details: [],
    })

    const api = useApi()
    const fn  = jest.fn((error) => error)

    onResponseError(fn)

    try {
      await api.get('/api/user')
    } catch {
      expect(fn).toBeCalled()
    }
  })

  it('should be able to registering on-request-error and on-request-error hook using onError()', async () => {
    mock.onGet('/api/user').reply(422, {
      code   : 422,
      message: 'Validation Error',
      details: [],
    })

    const api = useApi()
    const fn  = jest.fn((error) => Promise.reject(error))

    onError(fn)

    // mock request error
    const mockId = onRequest(jest.fn().mockRejectedValue('Hehe'))

    try {
      await api.get('/api/user')
    } catch {
      expect(fn).toBeCalledTimes(1)
      expect(fn).toBeCalledWith('Hehe')
    }

    removeHook('onRequest', mockId)

    try {
      await api.get('/api/user')
    } catch {
      expect(fn).toBeCalledTimes(2)
    }
  })

  it('should be able to remove hook with removeHook()', async () => {
    mock.onGet('/api/user').reply(200, [])

    const api = useApi()
    const fn  = jest.fn((response: AxiosResponse) => response)
    const id  = onResponse(fn)

    removeHook('onResponse', id)

    await api.get('/api/user')

    expect(fn).not.toBeCalled()
  })

  it('should remove all hook with resetHook()', async () => {
    mock.onGet('/api/user').reply(200, [])

    const api = useApi()
    const fn  = jest.fn(() => {})

    onRequest(fn)
    onResponse(fn)
    onRequestError(fn)
    onResponseError(fn)

    resetHook()

    await api.get('/api/user')

    expect(fn).not.toBeCalled()
  })
})

describe('Inherit instance', () => {
  it('should be able to create new instance with same config', async () => {
    mock.onGet('/v1/api/user').reply(200, { data: 'v1' })
    mock.onGet('/v2/api/user').reply(200, { data: 'v2' })

    const a = createApi({ baseURL: '/v1', headers: { foo: 'bar' } })
    const b = a.create({ baseURL: '/v2' })

    expect(b).not.toStrictEqual(a)

    const response = await b.get('/api/user')

    expect(response.config.headers.foo).toBe('bar')
    expect(response.data.data).toBe('v2')
  })

  it('should be copy hook to new instance', async () => {
    mock.onGet('/v1/api/user').reply(200, { data: 'v1' })
    mock.onGet('/v2/api/user').reply(200, { data: 'v2' })

    const a  = createApi({ baseURL: '/v1', headers: { foo: 'bar' } })
    const fn = jest.fn((config) => config)

    onRequest(fn, a)

    const b        = a.create({ baseURL: '/v2' })
    const expected = expect.objectContaining({
      baseURL: '/v2',
      headers: expect.objectContaining({
        foo: 'bar'
      })
    })

    await b.get('/api/user')

    expect(fn).toBeCalled()
    expect(fn).toBeCalledWith(expected)
  })
})
