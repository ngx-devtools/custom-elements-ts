import { TSRollupConfig, clean, build, copyPackageFile, copyReadMeFile, writeFile, symlinkDir } from 'aria-build'

(async function() {
  const options: TSRollupConfig[] = [
    {
      input: './src/index.ts',
      output: {
        format: 'umd',
        name: 'customElementsTs',
        file: './dist/custom-elements-ts.umd.js'
      }
    },
    {
      input: './src/index.ts',
      output: {
        format: 'es',
        file: './dist/custom-elements-ts.js'
      },
      tsconfig: {
        compilerOptions: {
          declaration: true
        }
      }
    },
    {
      input: './plugins/inline-template-plugin.ts',
      external: [ "typescript", "node-sass", "magic-string"  ],
      output: {
        format: 'cjs',
        file: './dist/plugins/inline-template-plugin.js'
      },
      tsconfig: {
        compilerOptions: {
          declaration: true
        }
      }
    }
  ]

  await clean('dist')
  await build(options)
  await Promise.all([ 
    copyPackageFile(), 
    copyReadMeFile(), 
    writeFile('./dist/custom-elements-ts.d.ts', `export * from './src/index'`) 
  ])
  await symlinkDir('./dist', './node_modules/custom-elements-ts')
})()