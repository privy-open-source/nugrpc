import { Module } from '@nuxt/types'
import path from 'path'

export * from './core/api'
export * from './utils/error'

const NugrpcApi: Module<void> = function () {
  this.addPlugin({ src: path.resolve(__dirname, './plugin/api.ts') })
  this.requireModule('@nuxtjs/axios')
}

export default NugrpcApi

// REQUIRED if publishing the module as npm package
export const meta = require('../package.json')
