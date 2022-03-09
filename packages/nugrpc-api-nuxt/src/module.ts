import { Module } from '@nuxt/types'
import path from 'path'

// export * from './runtime/api'
// export * from './error'

const NugrpcApi: Module<void> = function () {
  this.addPlugin({ src: path.resolve(__dirname, './runtime/api.mjs') })
  this.requireModule(['@nuxtjs/axios', { proxyHeaders: false }])
}

export default NugrpcApi

// REQUIRED if publishing the module as npm package
export const meta = {
  name     : '@privyid/nugrpc-api',
  version  : '1.0.0',
  configKey: 'nugrpcApi',
}
// import { defineNuxtModule, installModule, addPlugin } from "@nuxt/kit"

// export default defineNuxtModule({
//   meta: {
//     name   : '@privyid/nugrpc-api',
//     version: '1.0.0',
//   },
//   setup () {
//     addPlugin({ src: path.resolve(__dirname, './runtime/api.mjs') })
//     installModule('@nuxtjs/axios', { proxyHeaders: false })
//   }
// })
