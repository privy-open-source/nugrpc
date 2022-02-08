import { setupTest, expectModuleToBeCalledWith, get } from '@nuxt/test-utils'

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server : true,
  })

  it('should inject plugin', () => {
    expectModuleToBeCalledWith('requireModule', expect.stringMatching('@nuxtjs/axios'))
    expectModuleToBeCalledWith('addPlugin', { src: expect.stringContaining('plugin/api.js'), fileName: 'api.js' })
  })

  it('should work properly when import axios from "@privyid/nugrpc-api"', async () => {
    const { body } = await get('/ping')

    expect(body).toContain('<h1>Message: Pong!</h1>')
  })

  it('should work with axios interceptor (plugin extending axios)', async () => {
    const { body } = await get('/ping')

    expect(body).toContain('<h2>Header: This is custom header</h2>')
  })

  it('could return error code and message', async () => {
    const { body } = await get('/error')

    expect(body).toContain('<h1>Code: 422</h1>')
    expect(body).toContain('<h2>Message: Email is required</h2>')
  })
})
