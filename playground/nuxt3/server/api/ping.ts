import { getRequestHeader } from 'h3'

export default defineEventHandler((event) => {
  return {
    code   : 200,
    message: 'Pong!',
    data   : { header: getRequestHeader(event, 'x-custom-header') },
  }
})
