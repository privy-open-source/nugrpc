

import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  buildModules: ['@privyid/nugrpc-api-nuxt'],
  vite        : {
    define: {
      'process.env': {}
    }
  },
})
