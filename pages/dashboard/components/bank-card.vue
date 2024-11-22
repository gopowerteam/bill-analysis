<template>
  <ACard
    hoverable
    :loading="!data?.length"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        银行卡列表
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
          :data="data"
          :columns="columns"
          :pagination="false"
          :scroll="{ y: 250 }"
        >
          <template #amountTotal="{ record }">
            <div
              v-currency:[record.amountTotal]
              class="text-right"
            />
          </template>
          <template #channel="{ record }">
            <div class="flex-center space-x-2">
              <i
                v-if="record.channel.includes('WxPay')"
                class="icon-svg:wxpay w-20px h-20px"
              />
              <i
                v-if="record.channel.includes('AliPay')"
                class="icon-svg:alipay w-20px h-20px"
              />
            </div>
          </template>
        </ATable>
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
import { useStore } from '~/stores'

const store = useStore()

interface Card {
  cardName: string
  cardTailNumber: string
  countTotal: number
  channel: string[]
}

const orderBy = $ref<'orderByCount' | 'orderByAmount'>('orderByAmount')

let cards = $ref<{
  orderByAmount: Card[]
  orderByCount: Card[]
}>({
  orderByAmount: [],
  orderByCount: [],
})

const data = $computed(() => cards[orderBy as 'orderByCount' | 'orderByAmount'])

const columnsBase = [{
  title: '银行名称',
  dataIndex: 'cardName',
}, {
  title: '尾号',
  dataIndex: 'cardTailNumber',
  align: 'center' as const,
  width: 70,
}, {
  title: '渠道',
  dataIndex: 'channel',
  slotName: 'channel',
  width: 80,
  align: 'center' as const,
}]

const columns = $computed(() => {
  switch (orderBy) {
    case 'orderByCount':
      return [
        ...columnsBase,
        {
          title: '交易频次',
          dataIndex: 'countTotal',
          align: 'right' as const,
          width: 140,
        },
      ]
    case 'orderByAmount':
      return [
        ...columnsBase,
        {
          title: '交易金额',
          width: 140,
          dataIndex: 'amountTotal',
          slotName: 'amountTotal',
          align: 'right' as const,
        },
      ]
  }
})

async function requestData() {
  const { orderByCount, orderByAmount } = await $request('/api/report/:record/bank-card', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  cards = {
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
