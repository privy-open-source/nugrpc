import type { Validator } from '../rule'
import { when } from './when'

const mockValidator = (): Validator => {
  return {
    validate: jest.fn(() => {
      return {
        $valid  : true,
        $message: '',
      }
    })
  }
}

describe('when', () => {
  it('should execute truthy rules if condition true', () => {
    const rules: Validator = mockValidator()
    const validator        = when(() => true, [rules])

    validator.validate({})

    expect(rules.validate).toBeCalled()
  })

  it('should not execute truthy rules if condition false', () => {
    const rules: Validator = { validate: jest.fn() }
    const validator        = when(() => false, [rules])

    validator.validate({})

    expect(rules.validate).not.toBeCalled()
  })

  it('should execute falsy rules if condition false', () => {
    const ruleA: Validator = mockValidator()
    const ruleB: Validator = mockValidator()
    const validator        = when(() => false, [ruleA], [ruleB])

    validator.validate({})

    expect(ruleA.validate).not.toBeCalled()
    expect(ruleB.validate).toBeCalled()
  })

  it('should not execute falsy rules if condition true', () => {
    const ruleA: Validator = mockValidator()
    const ruleB: Validator = mockValidator()
    const validator        = when(() => true, [ruleA], [ruleB])

    validator.validate({})

    expect(ruleA.validate).toBeCalled()
    expect(ruleB.validate).not.toBeCalled()
  })
})
