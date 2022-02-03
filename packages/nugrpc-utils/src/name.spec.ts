import { pascalCase, getServiceName, getMethodName, getModelName, getUrl } from "./name"
import { load } from "./proto"
import path from "path"

describe('pascalCase', () => {
  const cases: [string, string][] = [
    ['Hello World', 'HelloWorld'],
    ['hello world', 'HelloWorld'],
    ['helloWorld',  'HelloWorld'],
    ['hello-world', 'HelloWorld'],
    ['hello_world', 'HelloWorld'],
    ['HELLO_WORLD', 'HelloWorld'],
  ]

  it.each(cases)('should be convert "%s" to "%s"', (input, output) => {
    expect(pascalCase(input)).toBe(output)
  })
})

const root    = load(path.resolve(__dirname, '../../../sample/sample.proto'))
const enum_   = root.lookupEnum('Statuses')
const type_   = root.lookupType('SampleMessage')
const service = root.lookupService('SearchService')
const method  = service.methods['Search']

describe('getServiceName', () => {
  it('should return name of service in PascalCase', () => {
    expect(getServiceName(service)).toBe('SearchService')
  })
})

describe('getMethodName', () => {
  it('should return name of service in camelCase', () => {
    expect(getMethodName(method)).toBe('search')
  })
})

describe('getModelName', () => {
  it('should return name of type in PascalCase', () => {
    expect(getModelName(type_)).toBe('SampleMessage')
  })

  it('should return name of enum in PascalCase', () => {
    expect(getModelName(enum_)).toBe('Statuses')
  })

  it('should return name with parent prefix', () => {
    expect(getModelName(type_.lookupType('SubMessage'))).toBe('SampleMessageSubMessage')
  })
})

describe('getUrl', () => {
  it('should convert method to an URL', () => {
    expect(getUrl(method)).toBe('/sample.transformer.ts.SearchService/Search')
  })
})
