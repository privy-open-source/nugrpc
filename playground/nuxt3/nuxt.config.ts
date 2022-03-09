

import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@privyid/nugrpc-api'],
  vite        : {
    define: {
      'process.env': {}
    }
  }
})
