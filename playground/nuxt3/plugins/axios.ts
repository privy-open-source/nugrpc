import { onRequest } from "@privyid/nugrpc-api"

export default defineNuxtPlugin(() => {
  onRequest((config) => {
    if (!config.headers['X-Custom-Header'])
      config.headers['X-Custom-Header'] = 'This is custom header'
  })
})
