import { onRequest } from "@privyid/nugrpc-api"
import { Plugin } from "@nuxt/types"

const plugin: Plugin = ({ $api }) => {
  onRequest((config) => {
    if (!config.headers['X-Custom-Header'])
      config.headers['X-Custom-Header'] = 'This is custom header'
  }, $api)
}

export default plugin
