import TextWriter from '.'

describe('Text Writer', () => {
  it('could write text line by line', () => {
    const writer   = new TextWriter()
    const expected = `Hello\nWorld\n`

    writer.write('Hello')
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could append text without create new line', () => {
    const writer   = new TextWriter()
    const expected = `HelloWorld\n`

    writer.write('Hello')
    writer.append('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add tab indent', () => {
    const writer   = new TextWriter()
    const expected = `Hello\n  World\n`

    writer.write('Hello')
    writer.tab()
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add new empty line', () => {
    const writer   = new TextWriter()
    const expected = `Hello\n\nWorld\n`

    writer.write('Hello')
    writer.line()
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add new line n times', () => {
    const writer   = new TextWriter()
    const expected = `Hello\n\n\n\nWorld\n`

    writer.write('Hello')
    writer.line(3)
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could back pointer on top of file (first line)', () => {
    const writer   = new TextWriter()
    const expected = `Foobar\nHello\nWorld\n`

    writer.write('Hello')
    writer.write('World')
    writer.home()
    writer.write('Foobar')

    expect(writer.toString()).toBe(expected)
  })

  it('could back pointer on top of file (last line)', () => {
    const writer   = new TextWriter()
    const expected = `Foobar\nHello\nWorld\nFooter\n`

    writer.write('Hello')
    writer.write('World')
    writer.home()
    writer.write('Foobar')
    writer.end()
    writer.write('Footer')

    expect(writer.toString()).toBe(expected)
  })

  it('could goto spesifice line', () => {
    const writer   = new TextWriter()
    const expected = `1st\n3rd\n2nd\n`

    writer.write('1st')
    writer.write('2nd')
    writer.goto(2)
    writer.write('3rd')

    expect(writer.toString()).toBe(expected)
  })
})
