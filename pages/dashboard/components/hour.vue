<template>
  <ACard
    hoverable
    :loading="!option"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        活跃-日
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
    <div
      class="p-10px w-full h-500px flex flex-col relative"
    >
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
const store = useStore()
let option = $ref<ECOption>()

const orderBy = $ref<'orderByCount' | 'orderByAmount'>('orderByCount')

let data = $ref< {
  time: string
  countTotal: number
  countWxPay: number
  countAliPay: number
  amountTotal: number
  amountWxPay: number
  amountAliPay: number
}[]>([])

async function requestData() {
  data = await $request('/api/report/:record/hour', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  render()
}

function render() {
  option = {
    animation: false,
    tooltip: {
      className: 'echarts-tooltip',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (data: any) => {
        const base = `${data.seriesName}<br>${data.marker}${data.name} `
        const maps = {
          总次数: 'countTotal',
          总金额: 'amountTotal',
          微信: orderBy === 'orderByAmount' ? 'amountWxPay' : 'countWxPay',
          支付宝: orderBy === 'orderByAmount' ? 'amountAliPay' : 'countAliPay',
        }

        switch (orderBy) {
          case 'orderByAmount':
            return base + useCurrency(data.value[maps[data.seriesName as keyof typeof maps]])
          case 'orderByCount':
            return base + `${data.value[maps[data.seriesName as keyof typeof maps]]}次`
        }
      },
    },
    legend: {
      selected: {
        总次数: true,
        微信: false,
        支付宝: false,
      },
    },
    toolbox: {
      show: false,
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    dataset: {
      dimensions: orderBy === 'orderByCount'
        ? ['time', 'countTotal', 'countWxPay', 'countAliPay']
        : ['time', 'amountTotal', 'amountWxPay', 'amountAliPay'],
      source: data,
    },
    xAxis: { type: 'category' },
    yAxis: {},
    itemStyle: { borderRadius: 3 },
    series: [{
      name: orderBy === 'orderByCount' ? '总次数' : '总金额',
      type: 'line',
      label: {
        show: true,
        formatter: ({ data }: { data: { countTotal: number, amountTotal: number } }) => {
          return orderBy === 'orderByCount' ? `${data.countTotal}` : useCurrency(data.amountTotal)
        },
      },

    },
    {
      name: '微信',
      type: 'line',
      label: {
        show: true,
        formatter: ({ data }: { data: { countWxPay: number, amountWxPay: number } }) => {
          return orderBy === 'orderByCount' ? `${data.countWxPay}` : useCurrency(data.amountWxPay)
        },
      },
    },
    {
      name: '支付宝',
      type: 'line',
      label: {
        show: true,
        formatter: ({ data }: { data: { countAliPay: number, amountAliPay: number } }) => {
          return orderBy === 'orderByCount' ? `${data.countAliPay}` : useCurrency(data.amountAliPay)
        },
      },
    }],
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
