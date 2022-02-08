const { resolve } = require('path')

module.exports = {
  server          : { port: 3000 },
  rootDir         : resolve(__dirname, '../../'),
  srcDir          : __dirname,
  buildDir        : resolve(__dirname, '.nuxt'),
  render          : { resourceHints: false },
  modules         : [require.resolve('../../dist')],
  plugins         : [{ src: '@/plugins/axios' }],
  alias           : { '@privyid/nugrpc-api': resolve(__dirname, '../../dist') },
  serverMiddleware: [
    { path: '/api/ping', handler: '@/api/ping' },
    { path: '/api/error', handler: '@/api/error' },
  ],
}
