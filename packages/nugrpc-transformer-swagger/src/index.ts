import {
  TransformAdapter,
  TransformContext,
  Saveable,
} from "@privyid/nugrpc-transformer"
import { OpenAPIV3 } from 'openapi-types'
import {
  getMethodName,
  getModelName,
  isMap,
  isModel,
  isEnum,
  isType,
  isService,
  Enum,
  Field,
  Model,
  ReflectionObject,
  Service,
  Type,
  getServiceName,
  getUrl,
} from "@privyid/nugrpc-utils"

export default class TransformerSwagger extends TransformAdapter implements Saveable {
  protected writer: OpenAPIV3.Document

  constructor (context: TransformContext) {
    super(context)

    this.writer = {
      openapi: '3.0.0',
      info   : {
        title  : context.packageName ?? 'Api',
        version: context.packageVersion ?? '1.0.0',
      },
      paths     : {},
      tags      : [],
      components: {
        schemas: {
          protobufAny: {
            type      : 'object',
            properties: {
              typeUrl: { type: 'string' },
              value  : {
                type  : 'string',
                format: 'byte',
              },
            },
          },
          rpcStatus: {
            type      : 'object',
            properties: {
              code: {
                type  : 'integer',
                format: 'int32',
              },
              message: { type: 'string' },
              details: {
                type : 'array',
                items: { $ref: '#/components/schemas/protobufAny' },
              },
            },
          },
        },
      },
    }

    if (context.baseUrl) {
      this.writer.servers = [{
        url      : context.baseUrl,
        variables: { baseUrl: { default: context.baseUrl }}
      }]
    }
  }

  getType (model: Model): OpenAPIV3.ReferenceObject {
    return { $ref: `#/components/schemas/${getModelName(model)}` }
  }

  getNonArrayType (type: string): OpenAPIV3.NonArraySchemaObjectType {
    switch (type) {
      case 'bool':
        return 'boolean'

      case 'double':
      case 'float':
        return 'number'

      case 'int32':
      case 'uint32':
      case 'sint32':
      case 'fixed32':
      case 'sfixed32':
        return 'integer'

      case 'int64':
      case 'uint64':
      case 'sint64':
      case 'fixed64':
      case 'sfixed64':
      case 'string':
      case 'bytes':
        return 'string'
    }

    /* istanbul ignore next */
    return 'object'
  }

  getFormatType (type: string): string | undefined {
    return type !== 'bool' && type !== this.getNonArrayType(type)
      ? type
      : undefined
  }

  getPrimitiveType (type: string): OpenAPIV3.SchemaObject {
    return {
      type  : this.getNonArrayType(type),
      format: this.getFormatType(type),
    }
  }

  getFieldType (field: Field): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
    let type = isModel(field.resolvedType)
      ? this.getType(field.resolvedType)
      : this.getPrimitiveType(field.type)

    if (isMap(field)) {
      type = {
        type                : 'object',
        additionalProperties: type,
      }
    }

    if (field.repeated)
      type = { type: 'array', items: type } as OpenAPIV3.SchemaObject

    return type
  }

  transformEnum (model: Enum) {
    const name = getModelName(model)

    if (this.writer.components?.schemas) {
      this.writer.components.schemas[name] = {
        'type'           : 'number',
        'enum'           : Object.values(model.values),
        'x-enum-varnames': Object.keys(model.values),
      } as OpenAPIV3.NonArraySchemaObject
    }
  }

  transformType (model: Type) {
    const name = getModelName(model)

    const schema: OpenAPIV3.SchemaObject = {
      type      : 'object',
      properties: {},
    }

    for (const field of model.fieldsArray) {
      field.resolve()

      if (schema.properties)
        schema.properties[field.name] = this.getFieldType(field)
    }

    if (this.writer.components?.schemas)
      this.writer.components.schemas[name] = schema
  }

  transformService (service: Service) {
    const serviceName = getServiceName(service)

    for (const method of service.methodsArray) {
      method.resolve()

      const methodName = getMethodName(method)
      const url        = getUrl(method)

      const request = isModel(method.resolvedRequestType)
        ? this.getType(method.resolvedRequestType)
        : /* istanbul ignore next */this.getPrimitiveType(method.requestType)

      const response = isModel(method.resolvedResponseType)
        ? this.getType(method.resolvedResponseType)
        : /* istanbul ignore next */this.getPrimitiveType(method.responseType)

      this.writer.paths[url] = {
        post: {
          tags       : [serviceName],
          operationId: methodName,
          requestBody: { content: { 'application/json': { schema: request } } },
          responses  : {
            200: {
              description: 'A successful response.',
              content    : { 'application/json': { schema: response } },
            },
            default: {
              description: 'An unexpected error response.',
              content    : { 'application/json': { schema: { $ref: '#/components/schemas/rpcStatus' } } },
            },
          },
        },
      }
    }

    this.writer.tags?.push({ name: serviceName })
  }

  transform (node: ReflectionObject) {
    if (isService(node))
      this.transformService(node)

    else if (isType(node))
      this.transformType(node)

    else if (isEnum(node))
      this.transformEnum(node)
  }

  toObject (): OpenAPIV3.Document {
    return this.writer
  }

  toString (): string {
    return JSON.stringify(this.toObject(), null, 2) + '\n'
  }
}


