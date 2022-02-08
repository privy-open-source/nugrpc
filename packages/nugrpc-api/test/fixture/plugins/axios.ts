import { Plugin } from '@nuxt/types'

const extendAxios: Plugin = ({ $axios }) => {
  $axios.onRequest((config) => {
    if (!config.headers['X-Custom-Header'])
      config.headers['X-Custom-Header'] = 'This is custom header'
  })
}

export default extendAxios
