import { 
  esbuild, clean, mkdir, TSRollupConfig, 
  esbuildDts, copyPackageFile, copyReadMeFile, 
  writeFile, symlinkDir, DEFAULT_VALUES
} from 'aria-build'

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
      external: [ 
        "typescript", 
        "node-sass", 
        "magic-string",
        ...DEFAULT_VALUES.ROLLUP_EXTERNALS 
      ],
      output: {
        format: 'cjs',
        file: './dist/plugins/inline-template-plugin.js'
      },
      tsconfig
    }
  ]

  const args = { config, esbuild: true  }

  await clean('dist')
  await mkdir('dist')
  await Promise.all([ 
    esbuild(args),
    esbuildDts(args),
    copyPackageFile(), 
    copyReadMeFile(), 
    writeFile('./dist/custom-elements-ts.d.ts', `export * from './src/index'`),
    symlinkDir('./dist', './node_modules/custom-elements-ts')
  ])
})()