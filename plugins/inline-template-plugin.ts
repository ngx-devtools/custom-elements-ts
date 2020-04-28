/* istanbul ignore file */

import { join, resolve } from 'path'

import MagicString from 'magic-string'
import { transform } from './transform'

function transformCode(code: string) {
  const magicString = new MagicString(code)
  return { 
    code: magicString.toString(), 
    map: magicString.generateMap({ hires: true })  
  }
}

export function inlineTemplateTransform() {
  return {
    name: 'inlineTemplateTransform',    
    transform (code: string, id: string) {  
      return (!id.includes(join(resolve(), 'node_modules')))
        ? transform(id, code)
        : transformCode(code)
    }
  }
}