
export default defineNuxtConfig({
  modules: ['@privyid/nugrpc-api-nuxt'],
  vite   : {
    define: {
      'process.env': {}
    }
  },
})
