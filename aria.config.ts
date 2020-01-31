import { copy } from 'aria-build'
import { inlineTemplateTransform } from './plugins/inline-template-plugin'

export default {
  plugins: {
    before: [ inlineTemplateTransform() ],
    after: [
      copy({
        targets: [
          { src: './demos/counter/index.html', dest: './public' }
        ]
      })
    ]
  },
  test: {
    plugins: {
      before: [ inlineTemplateTransform() ]
    }
  }
}