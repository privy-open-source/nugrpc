import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/error',
  ],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: true,
    esbuild  : { tsconfig: 'tsconfig.build.json' }
  },
})
