import { onRequest } from "@privyid/nugrpc-api"

export default function extendApi ({ $api }) {
  onRequest((config) => {
    if (!config.headers['X-Custom-Header'])
      config.headers['X-Custom-Header'] = 'This is custom header'
  }, $api)
}
