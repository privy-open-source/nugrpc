import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    './src/index',
    { input: './src/plugin', outDir: 'dist/plugin', builder: 'mkdist', format: 'cjs', ext: 'js' },
    { input: './src/plugin', outDir: 'dist/plugin', builder: 'mkdist', format: 'esm', ext: 'mjs' },
  ],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: true,
    esbuild  : { tsconfig: 'tsconfig.build.json', target: 'es2019', }
  },
})
