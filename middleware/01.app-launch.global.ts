import { useStore } from '~/stores'

async function toTask1() {

}

async function toTask2() {

}

export default defineNuxtRouteMiddleware(async () => {
  const store = useStore()

  if (store.ready || import.meta.client) {
    return
  }

  // run app luncher only when not ready and run on server
  await Promise.all([
    toTask1(),
    toTask2(),
  ])
})
