<template>
  <ASpin
    :loading="!option"
    class="w-full h-full"
  >
    <div class="p-10px w-full h-500px flex flex-col relative">
      <div class="title">
        活跃-年
      </div>
      <div class="flex-auto absolute inset-0">
        <VChart
          autoresize
          :option="option"
        />
      </div>
    </div>
  </ASpin>
</template>

<script setup lang="ts">
const store = useStore()
let option = $ref<ECOption>()

async function requestData() {
  console.log(store.record!.id)
  const data = await $request('/api/report/:record/month', {
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
