<template>
  <ACard
    :loading="!option"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        活跃-年
      </div>
    </template>
    <template #extra>
      <ARadioGroup
        v-model="orderBy"
        type="button"
        size="mini"
        @change="() => render()"
      >
        <ARadio value="orderByAmount">
          按金额
        </ARadio>
        <ARadio value="orderByCount">
          按频率
        </ARadio>
      </ARadioGroup>
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
import { unique } from 'radash'

const store = useStore()
let option = $ref<ECOption>()

const orderBy = $ref<'orderByCount' | 'orderByAmount'>('orderByCount')

let data = $ref<{
  time: string
  countTotal: number
  countWxPay: number
  countAliPay: number
  amountTotal: number
  amountWxPay: number
  amountAliPay: number
}[]>([])

async function requestData() {
  data = await $request('/api/report/:record/month', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  render()
}

function render() {
  option = {
    tooltip: {
      className: 'echarts-tooltip',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (data: any) => {
        const base = `${data.seriesName}<br>${data.marker}${data.name} `

        switch (orderBy) {
          case 'orderByAmount':
            return base + useCurrency(data.value)
          case 'orderByCount':
            return base + `${data.value}次`
        }
      },
    },
    legend: {},
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
        name: '支付宝',
        type: 'bar',
        barWidth: 10,
        data: data.map(x => orderBy === 'orderByAmount' ? x.amountAliPay : x.countAliPay),
        label: {
          show: true,
          position: 'top',
          formatter: ({ data }: { data: number }) => {
            return orderBy === 'orderByCount' ? `${data}` : useCurrency(data)
          },
        },
      },
      {
        name: '微信',
        type: 'bar',
        barWidth: 10,
        data: data.map(x => orderBy === 'orderByAmount' ? x.amountWxPay : x.countWxPay),
        label: {
          show: true,
          position: 'top',
          formatter: ({ data }: { data: number }) => {
            return orderBy === 'orderByCount' ? `${data}` : useCurrency(data)
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
