import Axios from 'axios'
import MockAdapter from "axios-mock-adapter"
import { createAxios, extendAxios, onRequest } from "."
import { jest }from "@jest/globals"

describe('Hooks', () => {
  let mock: MockAdapter

  beforeAll(() => {
    mock = new MockAdapter(Axios);
  });

  afterEach(() => {
    mock.reset();
  });

  test('coba', async () => {
    mock.onGet('/api/user').reply(200, [])

    const hook = jest.fn((config) => config)
    const api  = createAxios()

    onRequest(hook, api)

    const apiUser = api.extend({ baseURL: '/api' })

    await apiUser.get('/user')

    expect(hook).toHaveBeenCalled()
  })
})
