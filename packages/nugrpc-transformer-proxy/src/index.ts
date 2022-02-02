import { credentials, makeGenericClientConstructor, Metadata } from '@grpc/grpc-js'
import { ServiceClient } from '@grpc/grpc-js/build/src/make-client'
import { TransformAdapter, TransformContext } from "@privyid/nugrpc-transformer"
import { isService, ReflectionObject, Service, getUrl, Method } from "@privyid/nugrpc-utils"
import { Router, Request, Response, ErrorRequestHandler } from 'express'
import { json } from "body-parser";
import { rpc } from 'protobufjs'
import { formatError } from './error'
import { invoke, lowerFirst } from 'lodash'
import urlJoin from "url-join"

export interface RouterContext extends TransformContext {
  target: string;
}

const HOP_TO_HOP = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]

export default class TransformerProxy extends TransformAdapter {
  protected target: string;
  protected router: Router;
  protected client: ServiceClient;

  constructor (context: RouterContext) {
    super(context)

    const Client = makeGenericClientConstructor({}, context.target)

    this.target = context.target
    this.router = Router()
    this.client = new Client(context.target, credentials.createInsecure())

    this.router.use(json())
    this.router.use(this.handleError())
  }

  handleError (): ErrorRequestHandler {
    return (error, _request, response, next) => {
      if (error) {
        const formatedError = formatError(error)

        return response
          .status(formatedError.code)
          .json(formatError)
      }

      next()
    }
  }

  transform (node: ReflectionObject) {
    if (isService(node))
      this.transformService(node)
  }

  transformService (service: Service) {
    const serviceClient = service.create((method, requestData, callback) => {
      this.client.makeUnaryRequest(
        getUrl(method as Method).replace('/', ''),
        (arg) => Buffer.from(arg),
        (arg) => arg,
        requestData,
        callback
      )
    }, false, false)

    for (const method of service.methodsArray) {
      const url     = urlJoin(this.context.baseUrl, getUrl(method))
      const handler = this.transformMethod(serviceClient, method)

      this.router.post(url, handler)
    }
  }

  transformMethod (client: rpc.Service, method: Method) {
    return function handler (request: Request, response: Response) {
      const metadata = new Metadata()

      for (const [key, header] of Object.entries(request.headers)) {
        if (!HOP_TO_HOP.includes(key)) {
          const value = Array.isArray(header)
            ? header.join(';')
            : header

          metadata.add(key, Buffer.from(value))
        }
      }

      invoke(client, lowerFirst(method.name), request.body, metadata)
        .then((data: unknown) => {
          return response.json(data)
        })
        .catch((error: Error) => {
          const formatedError = formatError(error)

          return response
            .status(formatedError.code)
            .json(formatedError)
        })
    }
  }

  toRouter () {
    return this.router
  }
}
