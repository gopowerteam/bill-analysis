import { useStore } from '~/stores'

export default defineNuxtRouteMiddleware(async () => {
  const store = useStore()

  if (import.meta.client) {
    store.setReady()
  }
})
