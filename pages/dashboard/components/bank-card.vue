<template>
  <div>
    {{ 1 }}
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

onMounted(async () => {
  const data = await $fetch('/api/report/bank-card', {
    query: {
      batches,
    },
  })

  console.log('bank-card', data)
})
</script>

<style scoped>

</style>
