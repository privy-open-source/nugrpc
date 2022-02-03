import {
  ReflectionObject,
  Type,
  FieldBase,
  MapField,
  Enum,
  Namespace,
  Service,
  Field,
} from 'protobufjs'

export type Model = Type | Enum

export function isType (model: any): model is Type {
  return Boolean(model) && model instanceof Type
}

export function isService (model: any): model is Service {
  return Boolean(model) && model instanceof Service
}

export function isMap (field: any): field is MapField {
  return Boolean(field) && Boolean(field.map) && field instanceof MapField
}

export function isEnum (model: any): model is Enum {
  return Boolean(model) && model instanceof Enum
}

export function isModel (model: any): model is Model {
  return isType(model) || isEnum(model)
}

export function isNamespace (model: any): model is Namespace {
  return Boolean(model)
    && model instanceof Namespace
    && model.nestedArray.length > 0
}

export function isOneOf (field: Field, model: Type): boolean {
  return model.oneofsArray.some((oneof) => {
    return oneof.fieldsArray.some((field_) => field_.name === field.name)
  })
}
