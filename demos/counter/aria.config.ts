import { inlineTemplateTransform } from '../../plugins/inline-template-plugin'
import { copy } from 'aria-build'

export default {
  plugins: {
    before: [ 
      inlineTemplateTransform()
    ],
    after: [
      copy({
        targets: [
          { src: './demos/counter/index.html', dest: './public' }
        ]
      })
    ]
  }
}