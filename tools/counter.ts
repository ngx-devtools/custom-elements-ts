import { TSRollupConfig, build, clean, copyAssets, watcher, transformImport } from 'aria-build'
import { inlineTemplateTransform } from 'custom-elements-ts/plugins/inline-template-plugin'

import { startServer } from './server'

(async function() {
  const options: TSRollupConfig = {
    input: './demos/counter/counter.element.ts',
    external: [ 'custom-elements-ts', './dist/custom-elements-ts.js' ],
    plugins: {
      before: [ 
        transformImport({ 
          'custom-elements-ts': './dist/custom-elements-ts.js' 
        }),
        inlineTemplateTransform()
      ]
    },
    output: {
      format: 'es',
      sourcemap: true,
      file: './dist/counter/counter.element.js'
    }
  }

  await clean('./dist/counter')
  await Promise.all([
    build(options),
    copyAssets({ 
      targets: [
        { src: './demos/counter/*.html', dest: './dist/counter' }
      ] 
    }),
    watcher('./demos/counter', { 
      onReady(files: string[]) {
        console.log(`> Initial scan complete. Ready for changes. Total files: ${files.length}`)
        startServer({ 
          rootDir: './dist/counter',
          folders: [ 'dist' ]
        })
      },
      async onChange(file: string, stats: import('fs').Stats) {
        console.log(`File: ${file} was changed.`)
        await build(options)
      }
    })
  ])
})()