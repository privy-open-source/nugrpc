import { EOL } from 'os'

export default class TextWriter {
  private lines: Array<string | symbol>;
  private index: number;
  private tabs: number;

  constructor () {
    this.lines = []
    this.index = 0
    this.tabs  = 0
  }

  tab (tab = 1) {
    this.tabs = Math.max(this.tabs + tab, 0)

    return this
  }

  goto (target: number | symbol) {
    const index = typeof target === 'symbol'
      ? this.lines.indexOf(target) + 1
      : target

    this.index = Math.max(index - 1, 0)

    return this
  }

  home () {
    this.index = 0

    return this
  }

  end () {
    this.index = this.lines.length

    return this
  }

  write (...texts: string[]) {
    const content = `${'  '.repeat(this.tabs)}${texts.join('')}`.trimEnd()

    this.lines.splice(this.index++, 0, content)

    return this
  }

  append (...texts: string[]) {
    const oldContent = this.lines[this.index - 1]
    const newContent = texts.join('').trimEnd()

    if (typeof oldContent !== 'symbol')
      this.lines[this.index - 1] = `${oldContent}${newContent}`

    return this
  }

  line (line = 1) {
    for (let u = 0; u < line; u++)
      this.lines.splice(this.index++, 0, '')

    return this
  }

  mark (mark: symbol) {
    this.lines.splice(this.index++, 0, mark)

    return this
  }

  toString () {
    return `${this.lines.join(EOL)}${EOL}`
  }
}
