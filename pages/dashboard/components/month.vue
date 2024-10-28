<template>
  <div>
    {{ 1 }}
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

onMounted(async () => {
  const data = await $fetch('/api/report/month', {
    query: {
      batches,
    },
  })

  console.log('month', data)
})
</script>

<style scoped>

</style>
