// https://nuxt.com/docs/api/configuration/nuxt-config
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import { runtimeConfig } from './runtime.config'

export default defineNuxtConfig({
  modules: [
    ['@unocss/nuxt', {}],
    ['arco-design-nuxt-module', {}],
    ['@pinia/nuxt', {}],
    ['pinia-plugin-persistedstate/nuxt', {}],
    ['nuxt-file-storage', {}],
    ['dayjs-nuxt', {}],
    ['@nuxt/eslint', {}],
    ['nuxt-echarts', {}],
    ['nuxt-scheduler', {}],
    ['@vueuse/nuxt', {}],
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
  runtimeConfig,
  compatibilityDate: '2024-04-03',
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
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
  dayjs: {
    locales: ['zh-cn'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
    plugins: ['relativeTime', 'utc', 'timezone', 'minMax'],

  },
  echarts: {
    charts: ['LineChart', 'BarChart'],
    components: ['LegendComponent', 'TitleComponent', 'DatasetComponent', 'ToolboxComponent', 'GridComponent', 'TooltipComponent'],
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
