<template>
  <ACard
    :loading="!data?.length"
    hoverable
  >
    <template #title>
      <div class="title">
        交易方
      </div>
    </template>
    <div class="p-10px w-full h-500px relative space-y-10px">
      <div class="flex-auto">
        <ATable
          :height="500"
          :data="data"
          :columns="columns"
          :pagination="false"
        >
          <template #amount="{ record: { amount } }">
            <div class="flex space-x-2">
              {{ amount /100 }} 元
            </div>
          </template>
        </ATable>
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
const store = useStore()

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
  data = await $request('/api/report/:record/counterparty', {
    method: 'GET',
    params: {
      record: store.record!.id,
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
