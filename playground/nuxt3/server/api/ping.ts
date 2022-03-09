import type { IncomingMessage, ServerResponse } from 'http'

export default async function (request: IncomingMessage, response: ServerResponse) {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.write(JSON.stringify({
    code   : 200,
    message: 'Pong!',
    data   : { header: request.headers['x-custom-header'] },
  }))
  response.end()
}
