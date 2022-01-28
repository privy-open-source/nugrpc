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

export function isType (model: ReflectionObject | null): model is Type {
  return Boolean(model) && model instanceof Type
}

export function isService (model: ReflectionObject | null): model is Service {
  return Boolean(model) && model instanceof Service
}

export function isMap (field: FieldBase): field is MapField {
  return field.map && field instanceof MapField
}

export function isEnum (model: ReflectionObject | null): model is Enum {
  return Boolean(model) && model instanceof Enum
}

export function isModel (model: ReflectionObject | null): model is Model {
  return isType(model) || isEnum(model)
}

export function isNamespace (model: ReflectionObject | null): model is Namespace {
  return Boolean(model)
    && model instanceof Namespace
    && model.nestedArray.length > 0
}

export function isPackageRoot (model: ReflectionObject | null): boolean {
  return isNamespace(model)
    && model.nestedArray.some((child) => isModel(child) || isService(child))
}

export function isOneOf (field: Field, model: Type): boolean {
  return model.oneofsArray.some((oneof) => {
    return oneof.fieldsArray.some((field_) => field_.name === field.name)
  })
}
