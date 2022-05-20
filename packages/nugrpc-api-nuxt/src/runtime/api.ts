import { Plugin } from '@nuxt/types'
import { setApi, createApi, ApiConfig } from '@privyid/nugrpc-api'

const plugin: Plugin = (context, inject) => {
  const runtimeConfig = context.$config.nugrpcApi ?? {}
  const baseURL       = process.client
    ? (runtimeConfig.browserBaseURL || runtimeConfig.browserBaseUrl || runtimeConfig.baseURL || runtimeConfig.baseUrl || `<%= options.browserBaseURL || '' %>`)
    : (runtimeConfig.baseURL || runtimeConfig.baseUrl || process.env._AXIOS_BASE_URL_ || `<%= options.baseURL || '' %>`)

  const options: ApiConfig = {
    baseURL,
    headers: {},
  }

  if (process.server) {
    // Don't accept brotli encoding because Node can't parse it
    options.headers!['accept-encoding'] = 'gzip, deflate'
  }

  const instance = createApi(options)

  setApi(instance)
  inject('api', instance)
}

export default plugin
