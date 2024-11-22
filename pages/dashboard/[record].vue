<template>
  <div
    ref="container"
    class="p-10px"
  >
    <ASpin
      :style="{ position: 'absolute', inset: '0' }"
      :loading="!store.record"
      tip="正在加载中..."
    >
      <AGrid
        v-if="store.record"
        class="p-10px"
        :cols="2"
        :row-gap="12"
        :col-gap="12"
      >
        <AGridItem :span="2">
          <Record />
        </AGridItem>
        <AGridItem>
          <Hour />
        </AGridItem>
        <AGridItem>
          <Month />
        </AGridItem>
        <AGridItem>
          <BankCard />
        </AGridItem>
        <AGridItem>
          <Counterparty />
        </AGridItem>
        <AGridItem :span="2">
          <InOutTrend />
        </AGridItem>
      </AGrid>
    </ASpin>
  </div>
  <div class="fixed right-20px top-22px">
    <AButton
      @click="onExport"
    >
      <template #icon>
        <i class="icon-park:share" />
      </template>
      导出
    </AButton>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import Month from './components/month.vue'
import Hour from './components/hour.vue'
import BankCard from './components/bank-card.vue'
import Counterparty from './components/counterparty.vue'
import Record from './components/record.vue'
import InOutTrend from './components/in-out-trend.vue'
import { useStore } from '~/stores'

const dayjs = useDayjs()
const store = useStore()
const route = useRoute()
const container = useTemplateRef('container')
definePageMeta({
  name: 'dashboard',
})

async function requestRecord() {
  const id = route.params.record

  const record = await $request('/api/record', {
    method: 'GET',
    query: {
      id,
    },
  })

  if (record) {
    store.updateRecord(record)
  }
  else {
    Message.error('查询失败')
  }
}

provide('record', route.params.record)

function onExport() {
  if (container.value) {
    const element = container.value.firstElementChild!.firstElementChild as HTMLElement
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const data = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const creatIMg = document.createElement('a')
      creatIMg.download = `${store.record?.user.username}_${store.record?.user.id}_${dayjs().format('YYYY-MM-DD HH:mm:ss')}.png` // 设置下载的文件名
      creatIMg.href = data // 下载 url
      document.body.appendChild(creatIMg)
      creatIMg.click()
      creatIMg.remove()
    })
  }
}

onMounted(() => {
  requestRecord()
})
</script>

<style scoped>

</style>
