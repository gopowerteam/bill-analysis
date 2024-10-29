<template>
  <div class="p-10px w-full h-500px relative space-y-10px">
    <div class="title">
      银行卡列表
    </div>
    <div class="flex-auto">
      <ATable
        :height="500"
        :data="data"
        :columns="columns"
        :pagination="false"
      >
        <template #amount="{ record }">
          <div class="flex space-x-2">
            {{ record.amount /100 }} 元
          </div>
        </template>
      </ATable>
    </div>
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

let data = $ref<{
  cardName: string
  cardTailNumber: string
  countTotal: number
  channel: string[]
}[]>([])

const columns = [
  {
    title: '交易方',
    dataIndex: 'counterparty',
  }, {
    title: '交易次数',
    dataIndex: 'count',
    align: 'center' as const,
  }, {
    title: '交易金额',
    slotName: 'amount',
  }]
async function requestData() {
  data = await $fetch('/api/report/counterparty', {
    method: 'POST',
    body: {
      batches: batches,
    },
  })
}

onMounted(async () => {
  requestData()
})
</script>

<style scoped>
.title{
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  &::before{
    content: ' ';
    display: inline-block;
    width: 5px;
    height: 16px;
    background: red;
    margin-right: 8px;
    margin-left: 8px;
  }
}
</style>
