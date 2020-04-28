import * as mockfs from 'mock-fs'
import * as mock from 'mock-require'
import * as sinon from 'sinon'

import { expect } from 'aria-mocha'
import { transform } from './transform'
import { TSConfigOptions } from './transpile'

describe('transform', () => {
  let content = `
    @CustomElement({
      tag: 'cts-counter',
      templateUrl: './counter.html',
      styleUrl: './counter.css'
    })
    export class CounterElement extends HTMLElement { }  
  `  

  function createMock() {
    mockfs({
      'dist': {},
      'src': {
        'counter.ts': content,
        'counter.html': `<button id="count"></button>`,
        'counter.css': `:host { display: inline-block; } :host button { width: 50px; }`
      }
    })
  }

  afterEach(() => {
    mockfs.restore()
    mock.stopAll()
    sinon.restore()
  })

  it('should transform', () => {
    createMock()

    const { code, map } = transform('./src/counter.ts', content)
  })

  it('should transform with options', () => {
    const options: TSConfigOptions = {
      compilerOptions: { 
        outDir: 'dist'
      },
      transformers: {
        before: [],
        after: []
      }
    } 
    createMock()

    const { code, map } = transform('./src/counter.ts', content, options)
  })

  it('should transform with scss style', () => {
    content = `
      @CustomElement({
        tag: 'cts-counter',
        templateUrl: './counter.html',
        styleUrl: './counter.scss'
      })
      export class CounterElement extends HTMLElement { }  
    `

    mockfs({
      'dist': {},
      'src': {
        'counter.ts': content,
        'counter.html': `<button id="count"></button>`,
        'counter.scss': `:host { display: inline-block; } :host button { width: 50px; }`
      }
    })

    mock('node-sass', { 
      renderSync: () => ({ css: '' })
    })

    const { code, map } = transform('./src/counter.ts', content)
  })

  it('should not transform when decorator is not CustomElement', () => {
    content = `
      @Customelement({ tag: 'cts-counter' })
      export class CounterElement extends HTMLElement { }  
    `
    createMock()

    const { code, map } = transform('./src/counter.ts', content)
  })

  it('should not transform when decorator arguments is not typeof ObjectLiteralExpression', () => {
    content = `
      @CustomElement('hello')
      export class CounterElement extends HTMLElement { }  
    `
    createMock()

    const { code, map } = transform('./src/counter.ts', content)
  })

})