import { setupTest, expectModuleToBeCalledWith, get } from '@nuxt/test-utils'

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server : true,
  })

  it('should inject plugin', () => {
    expectModuleToBeCalledWith('requireModule', expect.stringMatching('@nuxtjs/axios'))
    expectModuleToBeCalledWith('addPlugin', { src: expect.stringContaining('plugin/api.ts') })
  })

  it('should work properly when import axios from "@privyid/nugrpc-api"', async () => {
    const { body } = await get('/ping')

    expect(body).toContain('<h1>Message: Pong!</h1>')
  })

  it('should work with axios intercetor', async () => {
    const { body } = await get('/ping')

    expect(body).toContain('<h2>Header: This is custom header</h2>')
  })
})
