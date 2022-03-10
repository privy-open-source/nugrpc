import TextWriter from '.'
import { EOL } from "os"

describe('Text Writer', () => {
  it('could write text line by line using .write()', () => {
    const writer   = new TextWriter()
    const expected = `Hello${EOL}World${EOL}`

    writer.write('Hello')
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could append text without create new line using .append()', () => {
    const writer   = new TextWriter()
    const expected = `HelloWorld${EOL}`

    writer.write('Hello')
    writer.append('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add tab indent using .tab()', () => {
    const writer   = new TextWriter()
    const expected = `Hello${EOL}  World${EOL}`

    writer.write('Hello')
    writer.tab()
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add new empty line using .line()', () => {
    const writer   = new TextWriter()
    const expected = `Hello${EOL}${EOL}World${EOL}`

    writer.write('Hello')
    writer.line()
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could add new line n times using .line(n)', () => {
    const writer   = new TextWriter()
    const expected = `Hello${EOL}${EOL}${EOL}${EOL}World${EOL}`

    writer.write('Hello')
    writer.line(3)
    writer.write('World')

    expect(writer.toString()).toBe(expected)
  })

  it('could back pointer on top of file (first line) using .home()', () => {
    const writer   = new TextWriter()
    const expected = `Foobar${EOL}Hello${EOL}World${EOL}`

    writer.write('Hello')
    writer.write('World')
    writer.home()
    writer.write('Foobar')

    expect(writer.toString()).toBe(expected)
  })

  it('could back pointer on bottom of file (last line) using .end()', () => {
    const writer   = new TextWriter()
    const expected = `Foobar${EOL}Hello${EOL}World${EOL}Footer${EOL}`

    writer.write('Hello')
    writer.write('World')
    writer.home()
    writer.write('Foobar')
    writer.end()
    writer.write('Footer')

    expect(writer.toString()).toBe(expected)
  })

  it('could goto spesifice line using .goto()', () => {
    const writer   = new TextWriter()
    const expected = `1st${EOL}3rd${EOL}2nd${EOL}`

    writer.write('1st')
    writer.write('2nd')
    writer.goto(2)
    writer.write('3rd')

    expect(writer.toString()).toBe(expected)
  })
})
