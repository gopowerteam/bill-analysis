// https://nuxt.com/docs/api/configuration/nuxt-config
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineNuxtConfig({
  modules: [
    ['@unocss/nuxt', {}],
    ['arco-design-nuxt-module', {}],
    ['@pinia/nuxt', {}],
    ['pinia-plugin-persistedstate/nuxt', {}],
    ['nuxt-file-storage', {}],
    ['dayjs-nuxt', {}],
    ['@nuxt/eslint', {}],
  ],
  imports: {
    dirs: [
      'config',
      'components',
      'components/**',
      'components/**/*',
      'composables',
      'composables/**',
      'store',
      'server/utils/**',
    ],
  },
  devtools: { enabled: true },
  css: [
    '@unocss/reset/tailwind.css',
    '@/styles/index.scss',
  ],
  compatibilityDate: '2024-04-03',
  vite: {
    plugins: [
      ReactivityTransform(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  piniaPluginPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'cookies',
  },
})
