import { Module } from '@nuxt/types'
import path from 'path'

export * from './core/api'
export * from './utils/error'

const NugrpcApi: Module<void> = function () {
  this.requireModule('@nuxtjs/axios')
  this.addPlugin({
    src     : path.resolve(__dirname, './plugin/api.ts'),
    fileName: 'nugrpc-api.js',
  })
}

export default NugrpcApi
