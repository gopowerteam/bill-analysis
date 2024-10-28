<template>
  <div>
    <div>
      <Month />
      <Hour />
      <BankCard />
      <Counterparty />
    </div>
  </div>
</template>

<script setup lang="ts">
import Month from './components/month.vue'
import Hour from './components/hour.vue'
import BankCard from './components/bank-card.vue'
import Counterparty from './components/counterparty.vue'

const route = useRoute()
const batches = route.query.batches

definePageMeta({
  name: 'dashboard',
  props: true,
})

provide('batches', batches)
onMounted(async () => {
})
</script>

<style scoped>

</style>
