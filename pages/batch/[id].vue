<template>
  <div
    v-if="batch"
    class="p-10px"
  >
    <ACard :hoverable="true">
      <ADescriptions :column="2">
        <ADescriptionsItem label="姓名">
          {{ batch?.user.username }}
        </ADescriptionsItem>
        <ADescriptionsItem label="姓名">
          {{ batch?.user.id }}
        </ADescriptionsItem>
        <ADescriptionsItem label="账单编号">
          {{ batch?.id }}
        </ADescriptionsItem>
        <ADescriptionsItem label="账单类型">
          {{ TransactionChannelDict.get(batch!.channel) }}
        </ADescriptionsItem>
        <ADescriptionsItem label="交易总数">
          {{ batch?.count }}
        </ADescriptionsItem>
        <ADescriptionsItem label="收入总额">
          <div v-currency:[batch?.inAmount] />
        </ADescriptionsItem>
        <ADescriptionsItem label="支出总额">
          <div v-currency:[batch?.outAmount] />
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard
      :bordered="false"
      :body-style="{ padding: '0', paddingTop: '10px' }"
    >
      <ATable
        :columns="columns"
        :data="batch?.transactions||[]"
        :pagination="{
          pageSize: 50,
        }"
      />
    </ACard>
  </div>
</template>

<script setup lang="tsx">
import type { TableColumnData } from '@arco-design/web-vue'
import dayjs from '#build/dayjs.imports.mjs'
import { TransactionTypeDict } from '~/config/dict.config'
import type { Batch } from '~/drizzle/schemas'

const route = useRoute()
let batch = $ref<Batch>()
//   counterparty: string
//   transactionMark: string
const columns: TableColumnData[] = [
  {
    title: '交易编号',
    dataIndex: 'transactionNo',
  },
  {
    title: '交易类型',
    dataIndex: 'transactionType',
    render: row => TransactionTypeDict.get(row.record.transactionType),
    width: 100,
  },
  {
    title: '交易方式',
    dataIndex: 'transactionMethod',
    width: 100,
  },
  {
    title: '交易方',
    dataIndex: 'counterparty',
  },
  {
    title: '交易金额',
    dataIndex: 'transactionAmount',
    render: row => useCurrency(row.record.transactionAmount),
    width: 120,
  },
  {
    title: '交易时间',
    dataIndex: 'transactionTime',
    render: row => dayjs(row.record.transactionTime).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '商户单号',
    dataIndex: 'merchantNo',
  },
]

async function requestBatch(id: string) {
  const data = await $request('/api/batch', {
    method: 'GET',
    query: { id },
  })

  if (data) {
    batch = data
  }
}

onMounted(() => {
  const id = route.params.id as string

  requestBatch(id)
})
</script>

<style scoped>

</style>
