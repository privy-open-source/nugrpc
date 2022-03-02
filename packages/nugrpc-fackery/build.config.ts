import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    './src/index'
  ],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: false,
    esbuild  : { tsconfig: 'tsconfig.build.json' },
  },
})
