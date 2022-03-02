import { camelCase, upperFirst } from 'lodash'
import { Model, isModel } from './is'
import { Method, Service } from 'protobufjs'

export function pascalCase (text: string): string {
  return upperFirst(camelCase(text))
}

export function getModelName (model: Model): string {
  const name   = model.name
  const parent = model.parent
  const prefix = isModel(parent)
    ? getModelName(parent)
    : ''

  return pascalCase(`${prefix}${name}`)
}

export function getServiceName (service: Service): string {
  return pascalCase(service.name)
}

export function getMethodName (method: Method): string {
  return camelCase(method.name)
}

export function getUrl (method: Method): string {
  /* istanbul ignore next */
  return `${method.parent?.fullName.replace('.', '/')}/${method.name}`
}
