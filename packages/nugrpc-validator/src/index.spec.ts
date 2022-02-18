import { required } from './rules/required'
import { object } from './rules/object'
import { each } from './rules/each'
import { when } from './rules/when'

describe('Validation', () => {
  it('should be validate the value', () => {
    const schema = object({
      name  : [required()],
      email : [required()],
      age   : [required()],
      detail: each(object({
        id  : [required()],
        name: [required()],
      })),
      privyId: each(required()).minLength(5),
      nik    : when((form) => !!form.age && form.age > 15, [required()]),
    })

    const data = {
      name    : 'Hello',
      detail  : [{ id: '123' }],
      privyId : ['uat001', 'uat002', 'uat003'],
      isActive: true,
    }

    const errors = schema.validate(data)

    expect(errors.$valid).toBe(false)
    expect(errors.detail.$message).toBe('validation.error.each')
    expect(errors.detail[0].name.$message).toBe('validation.error.required')
    expect(errors.privyId.$message).toBe('validation.error.must_be_no_less_than_length')
  })
})
