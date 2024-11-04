<template>
  <ACard
    :loading="!option"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        月均收入/支出趋势图
      </div>
    </template>
    <div class="p-10px w-full h-500px flex flex-col relative">
      <div class="flex-auto absolute inset-0">
        <VChart
          autoresize
          :option="option"
        />
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
import { unique, sum } from 'radash'
import { TransactionTypeEnum } from '~/drizzle/schemas'

const store = useStore()
let option = $ref<ECOption>()

async function requestData() {
  const data = await $request('/api/report/:record/in-out-trend', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  render(data)
}

function render(data: {
  time: string
  type: TransactionTypeEnum
  amount: number
}[]) {
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      orient: 'vertical',
      top: '0',
      left: '45',
      formatter: (name: string) => {
        switch (name) {
          case '收入':{
            const total = sum(data.filter(x => x.type === TransactionTypeEnum.In), x => x.amount)
            const avg = total / unique(data.map(x => x.time)).length
            return `收入 (共 ${useCurrency(total, { outputUnit: '千', suffix: false })}K 平均 ${(avg / 100000).toFixed(2)}K/月)`
          }
          case '支出':{
            const total = sum(data.filter(x => x.type === TransactionTypeEnum.Out), x => x.amount)
            const avg = total / unique(data.map(x => x.time)).length
            return `支出 (共 ${useCurrency(total, { outputUnit: '千', suffix: false })}K 平均 ${(avg / 100000).toFixed(2)}K/月)`
          }
        }
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    xAxis: {
      type: 'category',
      data: unique(data.map(x => x.time)),
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        barWidth: 20,
        data: data.filter(x => x.type === TransactionTypeEnum.In).map(x => x.amount / 100),
        label: {
          show: false,
          position: 'top',
          formatter: ({ data }: { data: number }) => {
            return useCurrency(data)
          },
        },
      },
      {
        name: '支出',
        type: 'bar',
        barWidth: 20,
        data: data.filter(x => x.type === TransactionTypeEnum.Out).map(x => x.amount / 100),
        label: {
          show: false,
          position: 'top',
          formatter: ({ data }: { data: number }) => {
            return useCurrency(data)
          },
        },
      },
    ],
  } as ECOption
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
