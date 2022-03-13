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

export function isType (model: unknown): model is Type {
  return Boolean(model) && model instanceof Type
}

export function isService (model: unknown): model is Service {
  return Boolean(model) && model instanceof Service
}

export function isMap (field: unknown): field is MapField {
  return Boolean(field) && Boolean((field as Field).map) && field instanceof MapField
}

export function isEnum (model: unknown): model is Enum {
  return Boolean(model) && model instanceof Enum
}

export function isModel (model: unknown): model is Model {
  return isType(model) || isEnum(model)
}

export function isNamespace (model: unknown): model is Namespace {
  return Boolean(model)
    && model instanceof Namespace
    && model.nestedArray.length > 0
}

export function isOneOf (field: Field, model: Type): boolean {
  return model.oneofsArray.some((oneof) => {
    return oneof.fieldsArray.some((field_) => field_.name === field.name)
  })
}
