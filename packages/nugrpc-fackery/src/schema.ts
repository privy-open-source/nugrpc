export type PrimitiveType = 'string' | 'number' | 'boolean'

export type PrimitiveMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
}

export type PrimitiveValueOf<T extends PrimitiveType> = PrimitiveMap[T]

export type TypeContext = {
  type: PrimitiveType;
  name?: string;
  modelName?: string;
}

export type Resolver = (context: TypeContext) => unknown

export type Type<T> = (context: Partial<TypeContext>, resolve: Resolver) => T

export type KeyOf<T> = string & keyof T

export type ObjectType<T> = {
  [K in keyof T]: Type<T[K]>;
}

export type ExtractValue<T extends ReadonlyArray<Type<any>>> = {
  [K in keyof T]: T[K] extends Type<infer V> ? V : never;
};

export function createString (): Type<string> {
  return (context, resolve) => {
    return resolve({ ...context, type: 'string' }) as string
  }
}

export function createNumber (): Type<number> {
  return (context, resolve) => {
    return resolve({ ...context, type: 'number' }) as number
  }
}

export function createBoolean (): Type<boolean> {
  return (context, resolve) => {
    return resolve({ ...context, type: 'boolean' }) as boolean
  }
}

export function createArray<T> (type: Type<T>, length = 10): Type<T[]> {
  return (context, resolve) => {
    return Array.from<T>({ length })
      .map(() => type(context, resolve))
  }
}

export function createObject<T> (objects: ObjectType<T>, modelName?: string): Type<T> {
  return (context, resolve) => {
    const keys    = Object.keys(objects)
    const entries = keys.map(key => {
      const data        = { ...context, name: key, modelName: context.name ?? modelName }
      const createValue = objects[key as KeyOf<T>]

      return [key, createValue(data, resolve)]
    })

    return Object.fromEntries(entries)
  }
}

export function createTuple<T extends ReadonlyArray<Type<any>>>(...types: T): Type<ExtractValue<T>> {
  return (context, resolve) => {
    return types.map((type) => type(context, resolve)) as any
  }
}

export default {
  object : createObject,
  string : createString,
  number : createNumber,
  boolean: createBoolean,
  array  : createArray,
}
