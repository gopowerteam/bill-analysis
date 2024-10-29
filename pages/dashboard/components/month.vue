<template>
  <div class="p-10px w-full h-500px flex flex-col relative">
    <div class="title">
      活跃-年
    </div>
    <div class="flex-auto absolute inset-0">
      <VChart
        :option="option"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const batches = inject('batches')

let option = $ref<ECOption>()

async function requestData() {
  const data = await $fetch('/api/report/month', {
    method: 'POST',
    body: {
      batches,
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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    xAxis: {
      type: 'category',
      data: data.map(x => x.time),
    },
    series: [
      {
        name: '支付宝',
        type: 'bar',
        barWidth: 10,
        data: data.map(x => x.countAliPay),
        label: { show: true, position: 'top' },
      },
      {
        name: '微信',
        type: 'bar',
        barWidth: 10,
        data: data.map(x => x.countWxPay),
        label: { show: true, position: 'top' },
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
