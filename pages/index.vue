<template>
  <div class="absolute inset-0 flex-center">
    <div class="space-y-20px">
      <div class="text-24px text-center">
        导入账单
      </div>
      <div class="flex space-x-20px">
        <div class="wxpay rounded-10px shadow h-200px w-250px flex-center relative">
          <div class="space-y-2 text-center">
            <i class="icon-park:wechat w-80px h-80px" />
            <div>微信</div>
          </div>
          <input
            class="absolute inset-0 opacity-0"
            type="file"
            @input="e => onUploadPDF('WxPay', e)"
          >
        </div>
        <div class="wxpay rounded-10px shadow h-200px w-250px flex-center relative">
          <div class="space-y-2 text-center">
            <i class="icon-park:alipay w-80px h-80px" />
            <div>支付宝</div>
          </div>
          <input
            class="absolute inset-0 opacity-0"
            type="file"
            @input="e => onUploadPDF('AliPay', e)"
          >
        </div>
      </div>
      <div class="w-520px rounded-10px shadow p-10px">
        <div v-if="batches.length">
          <div class="flex justify-between mb-10px">
            <div>姓名:{{ user?.username }}</div>
            <div>身份证号: {{ user?.idNumber }}</div>
          </div>
          <ADivider />
          <div class="space-y-2">
            <div
              v-for="(item) in batches"
              :key="item.batch"
              class="flex justify-between"
            >
              <div>编号: {{ item.batch }}</div>
              <div>{{ TransactionChannelDict.get(item.channel) }}</div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-#999 text-center"
        >
          请导入待分析的账单文件
        </div>
      </div>
      <AButton
        :disabled="batches.length===0"
        type="primary"
        class="h-50px w-520px"
        size="large"
        shape="round"
        @click="onSubmit"
      >
        开始分析
      </AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pick } from 'radash'
import { TransactionChannelDict } from '@/config/dict.config'

const { handleFileInput, files } = useFileStorage()

const batches = $ref<Omit<Bill, 'transactions'>[]>([])
const user = $computed(() => {
  if (batches.length) {
    return pick(batches[0], ['username', 'idNumber'])
  }
})
async function onUploadPDF(channel: 'AliPay' | 'WxPay', event: Event) {
  await handleFileInput(event)

  const [file] = files.value
  const data = await $request('/api/import', {
    method: 'post',
    body: {
      file,
      channel,
    },
  })

  if (batches.every(x => x.batch !== data.batch)) {
    batches.push(data)
  }
  else {
    Message.error('请勿重复导入账单')
  }

  const target = event.target as HTMLInputElement
  if (target) {
    target.value = ''
  }
}

async function onSubmit() {
  if (!batches.length) {
    return
  }

  if (!batches.every(item => item.idNumber === user?.idNumber)) {
    return Message.error('请确认是否为同一用户的账单')
  }

  const record = await $request('/api/record/create', {
    method: 'POST',
    body: {
      batches: batches.map(x => x.batch),
    },
  })

  console.log(record)
  navigateTo({
    name: 'dashboard',
    params: {
      record: record.id,
    },
  })
  // navigateTo({
  //   name: 'dashboard',
  //   params: {
  //     record: record.id,
  //   },
  // })
}
</script>

<style scoped>

</style>
