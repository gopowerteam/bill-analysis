<template>
  <div class="p-10px">
    <ASpin
      :style="{ position: 'absolute', inset: '0' }"
      :loading="!store.record"
      tip="正在加载中..."
    >
      <AGrid
        v-if="store.record"
        class="p-10px"
        :cols="2"
        :row-gap="12"
        :col-gap="12"
      >
        <AGridItem :span="2">
          <Record />
        </AGridItem>
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
    </ASpin>
  </div>
</template>

<script setup lang="ts">
import Month from './components/month.vue'
import Hour from './components/hour.vue'
import BankCard from './components/bank-card.vue'
import Counterparty from './components/counterparty.vue'
import Record from './components/record.vue'
import { useStore } from '~/stores'

const store = useStore()
const route = useRoute()

definePageMeta({
  name: 'dashboard',
})

async function requestRecord() {
  const id = route.params.record

  const record = await $request('/api/record', {
    method: 'GET',
    query: {
      id,
    },
  })

  if (record) {
    store.updateRecord(record)
  }
  else {
    Message.error('查询失败')
  }
}

provide('record', route.params.record)

onMounted(() => {
  requestRecord()
})
</script>

<style scoped>

</style>
