import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu, {
  rules: {
    '@typescript-eslint/no-invalid-void-type': 'off',
    'vue/no-multiple-template-root': 'off',
  },
})
