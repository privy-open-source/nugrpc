import { isType, isService, isEnum, isModel, isNamespace, isOneOf, isMap } from "./is"
import path from "pathe"
import { load } from "./proto"

const root    = load(path.resolve(__dirname, '../../../sample/sample.proto'))
const enum_   = root.lookupEnum('Statuses')
const service = root.lookupService('SearchService')
const method  = service.methods['Search']

const typeSubtype  = root.lookupType('SampleMessage')
const typeMapfield = root.lookupType('MapField')

const field    = typeSubtype.fields['field']
const mapField = typeMapfield.fields['permission']

test('isType', () => {
  expect(isType(root)).toBe(false)
  expect(isType(enum_)).toBe(false)
  expect(isType(service)).toBe(false)
  expect(isType(method)).toBe(false)
  expect(isType(typeSubtype)).toBe(true)
  expect(isType(typeMapfield)).toBe(true)
  expect(isType(field)).toBe(false)
  expect(isType(mapField)).toBe(false)
})

test('isService', () => {
  expect(isService(root)).toBe(false)
  expect(isService(enum_)).toBe(false)
  expect(isService(service)).toBe(true)
  expect(isService(method)).toBe(false)
  expect(isService(typeSubtype)).toBe(false)
  expect(isService(typeMapfield)).toBe(false)
  expect(isService(field)).toBe(false)
  expect(isService(mapField)).toBe(false)
})

test('isMap', () => {
  expect(isMap(root)).toBe(false)
  expect(isMap(enum_)).toBe(false)
  expect(isMap(service)).toBe(false)
  expect(isMap(method)).toBe(false)
  expect(isMap(typeSubtype)).toBe(false)
  expect(isMap(typeMapfield)).toBe(false)
  expect(isMap(field)).toBe(false)
  expect(isMap(mapField)).toBe(true)
})

test('isEnum', () => {
  expect(isEnum(root)).toBe(false)
  expect(isEnum(enum_)).toBe(true)
  expect(isEnum(service)).toBe(false)
  expect(isEnum(method)).toBe(false)
  expect(isEnum(typeSubtype)).toBe(false)
  expect(isEnum(typeMapfield)).toBe(false)
  expect(isEnum(field)).toBe(false)
  expect(isEnum(mapField)).toBe(false)
})

test('isModel', () => {
  expect(isModel(root)).toBe(false)
  expect(isModel(enum_)).toBe(true)
  expect(isModel(service)).toBe(false)
  expect(isModel(method)).toBe(false)
  expect(isModel(typeSubtype)).toBe(true)
  expect(isModel(typeMapfield)).toBe(true)
  expect(isModel(field)).toBe(false)
  expect(isModel(mapField)).toBe(false)
})

test('isNamespace', () => {
  expect(isNamespace(root)).toBe(true)
  expect(isNamespace(enum_)).toBe(false)
  expect(isNamespace(service)).toBe(false)
  expect(isNamespace(method)).toBe(false)
  expect(isNamespace(typeSubtype)).toBe(true)
  expect(isNamespace(typeMapfield)).toBe(false)
  expect(isNamespace(field)).toBe(false)
  expect(isNamespace(mapField)).toBe(false)
})

test('isOneOf', () => {
  const nonOneof = typeSubtype.fields['field']
  const oneOfA   = typeSubtype.fields['name']
  const oneOfB   = typeSubtype.fields['sub_message']

  expect(isOneOf(nonOneof, typeSubtype)).toBe(false)
  expect(isOneOf(oneOfA, typeSubtype)).toBe(true)
  expect(isOneOf(oneOfB, typeSubtype)).toBe(true)
})
