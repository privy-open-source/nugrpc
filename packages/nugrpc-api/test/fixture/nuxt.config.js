const { resolve } = require('path')

module.exports = {
  server          : { port: 3000 },
  rootDir         : __dirname,
  srcDir          : __dirname,
  buildDir        : resolve(__dirname, '.nuxt'),
  render          : { resourceHints: false },
  modules         : [{ handler: require('../../src').default }],
  plugins         : [{ src: '@/plugins/axios.ts' }],
  alias           : { '@privyid/nugrpc-api': resolve(__dirname, '../../src/index.ts') },
  serverMiddleware: [{ path: '/api/ping', handler: '@/api/ping.ts' }],
  buildModules    : [
    ['@nuxt/typescript-build', { loaders: { configFile: resolve(__dirname, './tsconfig.json') }}]
  ],
}
