module.exports = {
  server          : { port: 3000 },
  buildModules    : ['@privyid/nugrpc-api-nuxt'],
  plugins         : [{ src: '@/plugins/axios' }],
  serverMiddleware: [
    { path: '/api/ping', handler: '@/api/ping' },
    { path: '/api/error', handler: '@/api/error' },
  ],
}
