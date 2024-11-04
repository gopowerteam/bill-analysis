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
    <template #extra>
      <ARadioGroup
        v-model="orderBy"
        type="button"
        size="mini"
      >
        <ARadio value="orderByAmount">
          按金额
        </ARadio>
        <ARadio value="orderByCount">
          按频率
        </ARadio>
      </ARadioGroup>
    </template>
    <div class="p-10px w-full h-300px relative space-y-10px">
      <div class="flex-auto">
        <ATable
          :height="500"
          :data="data"
          :columns="columns"
          :pagination="false"
        >
          <template #amount="{ record: { amount } }">
            <div
              v-currency:[amount]
              class="space-x-2 text-right"
            />
          </template>
        </ATable>
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
const store = useStore()

const orderBy = $ref<'orderByCount' | 'orderByAmount'>('orderByAmount')

interface Counterparty {
  counterparty: string
  count: number
  amount: number
}

let counterpartys = $ref<{
  orderByAmount: Counterparty[]
  orderByCount: Counterparty[]
}>({
  orderByAmount: [],
  orderByCount: [],
})

const data = $computed(() => counterpartys[orderBy as 'orderByCount' | 'orderByAmount'])

const columns = [
  {
    title: '交易方',
    dataIndex: 'counterparty',
    ellipsis: true,
    tooltip: true,
  }, {
    title: '交易次数',
    dataIndex: 'count',
    align: 'center' as const,
    width: 100,
  }, {
    title: '交易金额',
    align: 'right' as const,
    slotName: 'amount',
    width: 140,
  }]

async function requestData() {
  const { orderByAmount, orderByCount } = await $request('/api/report/:record/counterparty', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  counterpartys = {
    orderByAmount,
    orderByCount,
  }
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
