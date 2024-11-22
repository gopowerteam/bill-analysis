<template>
  <div class="absolute inset-0">
    <ASpin
      class="w-full h-full"
      :loading="loading"
    >
      <div class="w-full h-full flex-center">
        <div class="space-y-20px">
          <div class="text-24px text-center ">
            导入账单
          </div>
          <div class="flex space-x-20px">
            <div class="wxpay rounded-10px shadow h-200px w-250px flex-center relative">
              <div class="space-y-2 text-center">
                <i class="icon-svg:wxpay w-80px h-80px" />
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
                <i class="icon-svg:alipay w-80px h-80px" />
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
                <div class="space-x-1">
                  <span class="text-#333">姓名: </span>
                  <span class="font-bold">{{ user?.username }}</span>
                </div>
                <div class="space-x-1">
                  <span class="text-#333">身份证号: </span>
                  <span class="font-bold">{{ user?.idNumber }}</span>
                </div>
              </div>
              <ADivider />
              <div class="space-y-2">
                <div
                  v-for="(item) in batches"
                  :key="item.batch"
                  class="flex items-center space-x-10px"
                >
                  <div>
                    <i
                      v-if="item.channel===TransactionChannelEnum.WxPay"
                      class="icon-svg:wxpay w-20px h-20px"
                    />
                    <i
                      v-if="item.channel===TransactionChannelEnum.AliPay"
                      class="icon-svg:alipay w-20px h-20px"
                    />
                  </div>
                  <div class="flex-auto">
                    编号: {{ item.batch }}
                  </div>
                  <div>
                    <AButton
                      type="text"
                      size="mini"
                      @click="() => onDelete(item.batch)"
                    >
                      <i class="icon-park-outline:close" />
                    </AButton>
                  </div>
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
          <div class="flex flex-col space-y-2">
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
            <AButton
              type="outline"
              class="h-50px w-520px"
              size="large"
              shape="round"
              @click="() => showHistory=true"
            >
              今日查询
            </AButton>
          </div>
        </div>
      </div>
    </ASpin>
    <ADrawer
      v-model:visible="showHistory"
      closable
      mask-closable
      placement="right"
      :width="340"
      title="今日查询"
      :footer="false"
    >
      <div class="space-y-2">
        <div
          v-for="record in records"
          :key="record.id"
          class="border-solid border-1px p-2 space-y-5px rounded-5px cursor-pointer hover:bg-#efefef"
          @click="() => onHistory(record)"
        >
          <div class="font-bold flex justify-between items-center">
            <div>{{ record.user.username }}</div>
            <div class="text-#333 text-12px">
              {{ record.user.id }}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex space-x-1">
              <div
                v-for="{ batch } in record.batches"
                :key="batch.id"
              >
                <ATooltip
                  v-if="batch.channel===TransactionChannelEnum.WxPay"
                  :content="batch.id"
                >
                  <i class="icon-svg:wxpay w-15px h-15px" />
                </ATooltip>
                <ATooltip
                  v-if="batch.channel===TransactionChannelEnum.AliPay"
                  :content="batch.id"
                >
                  <i class="icon-svg:alipay w-15px h-15px" />
                </ATooltip>
              </div>
            </div>
            <div class="text-#999 text-12px">
              {{ dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </div>
        </div>
      </div>
      <AEmpty v-if="!records.length">
        暂无今日查询记录
      </AEmpty>
    </ADrawer>
  </div>
</template>

<script setup lang="ts">
import { pick } from 'radash'
import { TransactionChannelEnum } from '~/drizzle/schemas'
import type { Record } from '~/drizzle/schemas'

const dayjs = useDayjs()
let loading = $ref(false)
const { handleFileInput, files } = useFileStorage()

let batches = $ref<Omit<Bill, 'transactions'>[]>([])
let records = $ref<Record[]>([])
const showHistory = $ref(false)
const user = $computed(() => {
  if (batches.length) {
    return pick(batches[0], ['username', 'idNumber'])
  }
})
async function onUploadPDF(channel: 'AliPay' | 'WxPay', event: Event) {
  loading = true
  try {
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
  catch (ex) {
    console.error(ex)
    Message.error('导入失败')
  }
  finally {
    loading = false
  }
}

function onDelete(batch: string) {
  batches = batches.filter(x => x.batch !== batch)
}

async function onSubmit() {
  if (!batches.length) {
    return
  }

  if (!batches.every(item => item.idNumber === user?.idNumber)) {
    return Message.error('请确认是否为同一用户的账单')
  }

  loading = true

  try {
    const record = await $request('/api/record/create', {
      method: 'POST',
      body: {
        batches: batches.map(x => x.batch),
      },
    })

    navigateTo({
      name: 'dashboard',
      params: {
        record: record.id,

      },
    })
  }
  catch (ex) {
    console.error(ex)
    Message.error('创建失败')
  }
  finally {
    loading = false
  }
}

function onHistory(record: Record) {
  navigateTo({
    name: 'dashboard',
    params: {
      record: record.id,
    },
  })
}

function requestRecordHistory() {
  $request('/api/record/history', {
    method: 'GET',
  }).then((data) => {
    records = data
  })
}

onMounted(() => {
  requestRecordHistory()
})
</script>

<style scoped>

</style>
