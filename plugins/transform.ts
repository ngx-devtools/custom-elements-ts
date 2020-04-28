import MagicString from 'magic-string'

import { TSConfigOptions, transpile } from './transpile'
import { inlineTemplate } from './inline-template'

export function transform(file: string, content: string, options?: TSConfigOptions) {
  const magicString = new MagicString(content)

  const { code, map } = transpile(magicString.toString(), {  
    compilerOptions: {
      ...(options?.compilerOptions ?? {})
    },
    transformers: {
      before: [ 
        inlineTemplate(file),
        ...(options?.transformers?.before ?? []) 
      ]
    }
  })

  return { code, map }
}