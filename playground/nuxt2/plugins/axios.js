export default function extendAxios ({ $axios }) {
  $axios.onRequest((config) => {
    if (!config.headers['X-Custom-Header'])
      config.headers['X-Custom-Header'] = 'This is custom header'
  })
}
