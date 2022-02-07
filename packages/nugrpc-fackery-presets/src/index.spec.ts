import usePreset from '.'

describe('Fackery Presets', () => {
  const presets = usePreset()

  it('should be a presets', () => {
    expect(Array.isArray(presets)).toBe(true)
  })

  it('should be have handler and type', () => {
    expect(presets.every((item) => item.type && typeof item.handler === 'function'))
      .toBe(true)
  })
})
