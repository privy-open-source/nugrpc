import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  server          : { port: 4000 },
  buildModules    : ['@privyid/nugrpc-api-nuxt'],
  plugins         : [{ src: '@/plugins/axios' }],
  serverMiddleware: [
    { path: '/api/ping', handler: '@/api/ping' },
    { path: '/api/error', handler: '@/api/error' },
  ],
})
