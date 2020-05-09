import { ebuild, TSRollupConfig, clean, copyPackageFile, copyReadMeFile, writeFile, symlinkDir } from 'aria-build'

(async function() {
  const tsconfig = {
    compilerOptions: {
      declaration: true
    }
  }

  const config: TSRollupConfig[] = [
    {
      input: './src/index.ts',
      output: [
        {
          format: 'umd',
          name: 'customElementsTs',
          file: './dist/custom-elements-ts.umd.js'
        },
        {
          format: 'es',
          file: './dist/custom-elements-ts.js'
        }
      ],
      tsconfig
    },
    {
      input: './plugins/inline-template-plugin.ts',
      external: [ "typescript", "node-sass", "magic-string"  ],
      output: {
        format: 'cjs',
        file: './dist/plugins/inline-template-plugin.js'
      },
      tsconfig
    }
  ]

  await clean('dist')
  await ebuild({ config })
  await Promise.all([ 
    copyPackageFile(), 
    copyReadMeFile(), 
    writeFile('./dist/custom-elements-ts.d.ts', `export * from './src/index'`) 
  ])
  await symlinkDir('./dist', './node_modules/custom-elements-ts')
})()