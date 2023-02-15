import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: true,
    esbuild  : { tsconfig: 'tsconfig.build.json' }
  },
  externals: [
    '@nuxt/types',
    '@nuxt/schema',
    '@nuxt/schema-edge',
  ]
})
