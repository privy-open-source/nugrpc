module.exports = {
  buildModules    : ['@nuxtjs/composition-api/module', '@privyid/nugrpc-api'],
  plugins         : [{ src: '@/plugins/axios' }],
  serverMiddleware: [
    { path: '/api/ping', handler: '@/api/ping' },
    { path: '/api/error', handler: '@/api/error' },
  ],
}
