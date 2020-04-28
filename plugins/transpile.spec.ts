import * as mockfs from 'mock-fs'
import * as fs from 'fs'

import { expect } from 'aria-mocha'
import { transpile, TSConfigOptions } from './transpile'

describe('transpile', () => {
  const content = `
    @CustomElement({
      tag: 'cts-counter',
      templateUrl: './counter.html',
      styleUrl: './counter.css'
    })
    export class CounterElement extends HTMLElement { }  
  `  

  beforeEach(() => {
    mockfs({
      'dist': {},
      'src': {
        'counter.ts': content,
        'counter.html': `<button id="count"></button>`,
        'counter.css': `
          :host { display: inline-block; }
          :host button { width: 50px; }
        `
      }
    })
  })

  afterEach(() => {
    mockfs.restore()
  })

  it('should transpile', () => {
    const { code, map } = transpile(content)
  })

  it('should transpile with options', () => {
    const options: TSConfigOptions = {
      compilerOptions: { 
        outDir: 'dist'
      },
      transformers: {
        before: []
      }
    } 

    const { code, map } = transpile(content, options)
  })

})