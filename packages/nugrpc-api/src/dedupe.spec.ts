import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import Axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { useApi } from "."

let mock: MockAdapter

beforeAll(() => {
  mock = new MockAdapter(Axios)
})

afterEach(() => {
  mock.reset()
})

describe('DedupeAdapter', () => {
  it('should cancel previous request with same requestId', async () => {
    mock.onGet('/api/ping').reply(200, { message: 'Pong' })

    const api    = useApi()
    const a      = api.get('/api/ping', { requestId: 'ping' })
    const b      = api.get('/api/ping', { requestId: 'ping' })
    const result = await Promise.allSettled([a, b])

    expect(result[0].status).toBe('rejected')
    expect(result[1].status).toBe('fulfilled')
  })

  it('should do nothing if requestId is different', async () => {
    mock.onGet('/api/ping').reply(200, { message: 'Pong' })

    const api    = useApi()
    const a      = api.get('/api/ping', { requestId: 'ping/a' })
    const b      = api.get('/api/ping', { requestId: 'ping/b' })
    const result = await Promise.allSettled([a, b])

    expect(result[0].status).toBe('fulfilled')
    expect(result[1].status).toBe('fulfilled')
  })

  it('should be able to cancel via AbortController', async () => {
    mock.onGet('/api/ping').reply(200, { message: 'Pong' })

    const api        = useApi()
    const controller = new AbortController()
    const signal     = controller.signal

    const a = api.get('/api/ping', { requestId: 'ping/d', signal })
    const b = api.get('/api/ping', { requestId: 'ping/e' })

    controller.abort()

    const result = await Promise.allSettled([a, b])

    expect(result[0].status).toBe('rejected')
    expect(result[1].status).toBe('fulfilled')
  })
})

describe('cancel', () => {
  it('should be cancel request only specific requestId', async () => {
    mock.onGet('/api/ping').reply(200, { message: 'Pong' })

    const api = useApi()
    const a   = api.get('/api/ping', { requestId: 'ping/i' })
    const b   = api.get('/api/ping', { requestId: 'ping/j' })

    api.cancel('ping/i')

    const result = await Promise.allSettled([a, b])

    expect(result[0].status).toBe('rejected')
    expect(result[1].status).toBe('fulfilled')
  })
})

describe('cancelAll', () => {
  it('should be cancel all active request', async () => {
    mock.onGet('/api/ping').reply(200, { message: 'Pong' })

    const api = useApi()
    const a   = api.get('/api/ping', { requestId: 'ping/x' })
    const b   = api.get('/api/ping', { requestId: 'ping/y' })

    api.cancelAll()

    const result = await Promise.allSettled([a, b])

    expect(result[0].status).toBe('rejected')
    expect(result[1].status).toBe('rejected')
  })
})
