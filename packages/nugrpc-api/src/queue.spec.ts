import MockAdapter from "axios-mock-adapter"
import Axios from "axios"
import { createAxios, useAxios } from "."

let mock: MockAdapter

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  mock = new MockAdapter(Axios, { delayResponse: 10 })
})

afterEach(() => {
  mock.reset()
})

describe('QueueAdapter', () => {
  it('should run 2 requests first, and queue last 2 requests', async () => {
    mock.onGet('/ping').reply(200, 'Pong')

    const result = []
    const api    = createAxios({ queue: { worker: 2 }})

    api.get('/ping').then(() => result.push(1))
    api.get('/ping').then(() => result.push(2))
    api.get('/ping').then(() => result.push(3))
    api.get('/ping').then(() => result.push(4))

    await delay(10)

    expect(result).toHaveLength(2)

    await delay(10)

    expect(result).toHaveLength(4)
  })

  it('should run request with higher priority first', async () => {
    mock.onGet('/ping').reply(200, 'Pong')

    const result = []
    const api    = createAxios({ queue: { worker: 1 }})

    api.get('/ping').then(() => result.push(1))
    api.get('/ping', { priority: 2 }).then(() => result.push(2))
    api.get('/ping', { priority: 3 }).then(() => result.push(3))
    api.get('/ping').then(() => result.push(4))
    api.get('/ping').then(() => result.push(5))

    await delay(55)

    expect(result).toHaveLength(5)
    expect(result).toStrictEqual([1, 3, 2, 4, 5])
  })
})
