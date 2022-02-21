# nugrpc-validator
> Opinionated form validator

## How to use
```js
import {
  object,
  each,
  when,
  required,
  isAlpha,
  isEmail,
} from "@privyid/nugrpc-validator"

const form = { /* some data */ }

const schema = object({
  name : [required(), isAlpha()],
  email: [required(), isEmail()],
  age  : [required(), minValue(17)],

  /* repeated rules */
  members: each(object({
    id  : [required(), isUuid()],
    name: [required()],
  })),

  /* conditional rules */
  phone: when(({ email }) => email === '', [
    required(),
  ]),
})

const errors = schema.validate(form)
errors.$valid // true | false
```

## Available Rules

- [x] required()
- [ ] ~~empty()~~ -> unimplemented, already covered with required()
- [ ] ~~nil()~~ -> unimplemented, already covered with required()
- [ ] ~~notNil()~~ -> unimplemeted, covered with required()
- [ ] ~~nilOrEmpty()~~ -> unimplemented, already covered with required()
- [x] ~~in()~~ -> mustBeIn() - name "in" is reserved in Javascript
- [x] ~~notIn()~~ -> mustNotIn()
- [x] minValue()
- [x] maxValue()
- [x] minLength()
- [x] maxLength()
- [x] length()
- [x] isAlpha()
- [x] isAlphaSpace()
- [x] isAlphaUnderscore()
- [x] isLowerAlphaUnderscore()
- [x] isDigit()
- [x] isAlphaNumeric()
- [x] isAlphaNumericSpace()
- [x] isAlphaNumericSpaceWithSpecialCharacter()
- [x] isDate()
- [x] isTime() - ! slightly different implementation with Carstenz
- [x] isUuid()
- [x] isInt()
- [x] isFloat()
- [x] isPhone()
- [x] isEmail()
- [x] isUrl()
- [x] isJson()

### Special Rules
- [x] object()
- [x] each()
- [x] when()
- [x] equalTo()
