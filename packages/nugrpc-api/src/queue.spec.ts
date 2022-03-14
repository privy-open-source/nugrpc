import MockAdapter from "axios-mock-adapter"
import Axios from "axios"
import { createApi } from "."

let mock: MockAdapter

beforeAll(() => {
  mock = new MockAdapter(Axios, { delayResponse: 1 })
})

afterEach(() => {
  mock.reset()
})

describe('QueueAdapter', () => {
  it('should run 2 requests first, and queue last 2 requests', async () => {
    mock.onGet('/ping').reply(200, 'Pong')

    const result = []
    const api    = createApi({ queue: { worker: 2 }})

    await Promise.race([
      Promise.all([
        api.get('/ping').then(() => result.push(1)),
        api.get('/ping').then(() => result.push(2)),
      ]),
      Promise.all([
        api.get('/ping').then(() => result.push(3)),
        api.get('/ping').then(() => result.push(4)),
      ])
    ])

    expect(result).toHaveLength(2)
    expect(result).toStrictEqual([1, 2])
  })

  it('should run request with higher priority first', async () => {
    mock.onGet('/ping').reply(200, 'Pong')

    const result = []
    const api    = createApi({ queue: { worker: 1 }})

    await Promise.all([
      api.get('/ping').then(() => result.push(1)),
      api.get('/ping', { priority: 2 }).then(() => result.push(2)),
      api.get('/ping', { priority: 3 }).then(() => result.push(3)),
      api.get('/ping').then(() => result.push(4)),
      api.get('/ping').then(() => result.push(5)),
    ])

    expect(result).toHaveLength(5)
    expect(result).toStrictEqual([1, 3, 2, 4, 5])
  })
})
