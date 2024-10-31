<template>
  <ACard
    :loading="!data?.length"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        银行卡列表
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
          <template #channel="{ record }">
            <div class="flex space-x-2">
              <i
                v-if="record.channel.includes('WxPay')"
                class="icon-park-outline:wechat"
              />
              <i
                v-if="record.channel.includes('AliPay')"
                class="icon-park-outline:alipay"
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

let data = $ref<{
  cardName: string
  cardTailNumber: string
  countTotal: number
  channel: string[]
}[]>([])

const columns = [{
  title: '银行名称',
  dataIndex: 'cardName',
}, {
  title: '银行卡尾号',
  dataIndex: 'cardTailNumber',
  align: 'center' as const,
}, {
  title: '交易次数',
  dataIndex: 'countTotal',
}, {
  title: '关联渠道',
  dataIndex: 'channel',
  slotName: 'channel',
}]

async function requestData() {
  data = await $request('/api/report/:record/bank-card', {
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
