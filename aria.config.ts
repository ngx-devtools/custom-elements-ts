import { inlineTemplateTransform } from './plugins/inline-template-plugin'

export default {
  test: {
    plugins: {
      before: [ inlineTemplateTransform() ]
    }
  }
}