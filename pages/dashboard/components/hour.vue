<template>
  <div>
    {{ 1 }}
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

onMounted(async () => {
  const data = await $fetch('/api/report/hour', {
    query: {
      batches,
    },
  })

  console.log('hour', data)
})
</script>

<style scoped>

</style>
