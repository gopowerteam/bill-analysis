<template>
  <div>
    {{ 1 }}
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

onMounted(async () => {
  const data = await $fetch('/api/report/counterparty', {
    query: {
      batches,
    },
  })

  console.log('counterparty', data)
})
</script>

<style scoped>

</style>
