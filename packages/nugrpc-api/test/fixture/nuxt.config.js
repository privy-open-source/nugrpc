const { resolve } = require('path')
const nugrpApi    = require('../..').default

module.exports = {
  server          : { port: 3000 },
  rootDir         : resolve(__dirname, '../../'),
  srcDir          : __dirname,
  buildDir        : resolve(__dirname, '.nuxt'),
  render          : { resourceHints: false },
  modules         : [nugrpApi],
  plugins         : [{ src: '@/plugins/axios' }],
  alias           : { '@privyid/nugrpc-api': resolve(__dirname, '../..') },
  serverMiddleware: [
    { path: '/api/ping', handler: '@/api/ping' },
    { path: '/api/error', handler: '@/api/error' },
  ],
}
