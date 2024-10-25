export default defineNuxtRouteMiddleware(async () => {
  const appStore = useAppStore()

  if (import.meta.client) {
    appStore.setReady()
  }
})
