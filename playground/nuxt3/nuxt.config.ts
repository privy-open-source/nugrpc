

import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@privyid/nugrpc-api-nuxt'],
  vite        : {
    define: {
      'process.env': {}
    }
  }
})
