<template>
  <div>
    <AGrid
      :cols="2"
      :row-gap="12"
      :col-gap="12"
    >
      <AGridItem>
        <Hour />
      </AGridItem>
      <AGridItem>
        <Month />
      </AGridItem>
      <AGridItem>
        <BankCard />
      </AGridItem>
      <AGridItem>
        <Counterparty />
      </AGridItem>
    </AGrid>
    <div />
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
