import type { IncomingMessage, ServerResponse } from 'http'


export default function (request: IncomingMessage, response: ServerResponse) {
  response.writeHead(422, { 'Content-Type': 'application/json' })
  response.write(JSON.stringify({
    code   : 422,
    message: 'Email is required',
    details: [],
  }))
  response.end()
}
