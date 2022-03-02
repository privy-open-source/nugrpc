import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    './src/index',
    { input: './src/plugin', outDir: 'dist/plugin', builder: 'mkdist', format: 'cjs', ext: 'js' },
  ],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: false,
    esbuild  : { tsconfig: 'tsconfig.build.json', target: 'es2019' }
  },
})
