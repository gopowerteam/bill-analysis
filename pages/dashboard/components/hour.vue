<template>
  <ACard
    :loading="!option"
    class="w-full h-full"
  >
    <template #title>
      <div class="title">
        活跃-日
      </div>
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

async function requestData() {
  const data = await $request('/api/report/:record/hour', {
    method: 'GET',
    params: {
      record: store.record!.id,
    },
  })

  render(data)
}

function render(data: {
  time: string
  countTotal: number
  countWxPay: number
  countAliPay: number
}[]) {
  option = {
    animation: false,
    tooltip: {
      className: 'echarts-tooltip',
    },
    toolbox: {
      show: false,
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    dataset: {
      dimensions: ['time', 'countTotal', 'countWxPay', 'countAliPay'],
      source: data,
    },
    xAxis: { type: 'category' },
    yAxis: {},
    itemStyle: { borderRadius: 3 },
    series: [{
      name: '使用次数',
      type: 'line', label: { show: true },
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
