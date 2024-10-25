// https://nuxt.com/docs/api/configuration/nuxt-config
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
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
  modules: [
    ['@unocss/nuxt', {}],
    ['arco-design-nuxt-module', {}],
    ['@pinia/nuxt', {}],
    ['pinia-plugin-persistedstate/nuxt', {}],
    ['nuxt-file-storage', {}],
    ['dayjs-nuxt', {}],
    ['@nuxt/eslint', {}],
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '@/styles/index.scss',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  piniaPluginPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'cookies',
  },
  eslint: {
    config:{
      stylistic: true
    }
  }
})
