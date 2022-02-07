import faker, { UsableLocale } from '@faker-js/faker'
import type { Rule } from '@privyid/nugrpc-fackery'

export default function usePresets (language: UsableLocale = 'en'): Rule[] {
  faker.setLocale(language)

  return [
    // city
    {
      type   : 'string',
      name   : /city/i,
      handler: () => faker.address.city(),
    },
    // province, state
    {
      type   : 'string',
      name   : /(province|state)/i,
      handler: () => faker.address.state(),
    },
    // created_at, updated_at, deleted_at, createdAt, updatedAt, deletedAt, etc
    {
      type   : 'string',
      name   : (name) => name.endsWith('ed_at') || name.endsWith('edAt'),
      handler: () => faker.date.recent().toISOString(),
    },
    // PrivyID
    {
      type   : 'string',
      name   : ['privyId', 'privyID', 'privy_id'],
      handler: () => faker.helpers.replaceSymbols('??####'),
    },
    // id. user_id, id_user, userID, uuid with type string return UUID
    {
      type   : 'string',
      name   : (name: string) => name.toLowerCase().startsWith('id') || name.toLowerCase().endsWith('id'),
      handler: () => faker.datatype.uuid(),
    },
    // name, username, firstName, fullName
    {
      type   : 'string',
      name   : /name$/i,
      handler: () => faker.name.findName(),
    },
    // email
    {
      type   : 'string',
      name   : /email/i,
      handler: () => faker.internet.email(),
    },
    // phone
    {
      type   : 'string',
      name   : /phone/i,
      handler: () => faker.phone.phoneNumber(),
    },
    // response meta: page
    {
      type   : 'number',
      name   : 'page',
      handler: () => 1,
    },
    // response meta: perPage
    {
      type   : 'number',
      name   : ['perPage', 'per_page', 'limit'],
      handler: () => 10,
    },
    // anything with type string (for fallback)
    {
      type   : 'string',
      handler: () => faker.datatype.string(),
    },
    // anything with type number (for fallback)
    {
      type   : 'number',
      handler: () => faker.datatype.number()
    },
    // anything with type boolean (for fallback)
    {
      type   : 'boolean',
      handler: () => faker.datatype.boolean(),
    }
  ]
}
