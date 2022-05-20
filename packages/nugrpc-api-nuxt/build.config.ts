import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    './src/module',
    { input: './src/runtime/', outDir: './dist/runtime/' },
  ],
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
