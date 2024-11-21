<template>
  <div class="flex">
    <ACard
      class="flex-center"
      hoverable
    >
      <div class="flex space-x-10px font-bold">
        <ADescriptions
          :column="1"
          class="w-200px"
          layout="vertical"
          :value-style="{ fontWeight: 'bold' }"
        >
          <ADescriptionsItem label="姓名:">
            <span>  {{ store.record?.user.username }}</span>
            <i
              class="icon-park-outline:copy-one cursor-pointer"
              @click="onCopy(store.record!.user!.username!)"
            />
          </ADescriptionsItem>
          <ADescriptionsItem label="  身份证号:">
            <span>  {{ store.record?.user.id }}</span>
            <i
              class="icon-park-outline:copy-one cursor-pointer"
              @click="onCopy(store.record!.user!.id!)"
            />
          </ADescriptionsItem>
        </ADescriptions>
      </div>
    </ACard>
    <ACard class="flex-auto">
      <ATabs>
        <ATabPane
          key="total"
          title="统计"
          class="shadow p-10px"
        >
          <template #title>
            <div
              class="flex items-center space-x-2"
            >
              <i class="icon-park:funds w-20px h-20px" />
              <div>合计</div>
            </div>
          </template>
          <ADescriptions
            :column="2"
            class="h-120px"
          >
            <ADescriptionsItem label="账单数量">
              {{ store?.record?.batches.length }}
            </ADescriptionsItem>
            <ADescriptionsItem label="交易次数">
              {{ sum(store!.record!.batches, x => x.batch.count) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="收入总额">
              <span v-currency:[data.inAmount] />
            </ADescriptionsItem>
            <ADescriptionsItem label="支出总额">
              <span v-currency:[data.outAmount] />
            </ADescriptionsItem>
            <ADescriptionsItem label="开始时间">
              {{ dayjs(data.startTime).format('YYYY-MM-DD HH:mm:ss') }}
            </ADescriptionsItem>
            <ADescriptionsItem label="结束时间">
              {{ dayjs(data.endTime).format('YYYY-MM-DD HH:mm:ss') }}
            </ADescriptionsItem>
          </ADescriptions>
        </ATabPane>
        <ATabPane
          v-for="item in store?.record?.batches"
          :key="item.batchId"
          class="shadow p-10px"
        >
          <template #title>
            <div
              v-if="item.batch.channel===TransactionChannelEnum.WxPay"
              class="flex items-center space-x-2"
            >
              <i class="icon-svg:wxpay w-20px h-20px" />
              <div>微信</div>
            </div>
            <div
              v-if="item.batch.channel===TransactionChannelEnum.AliPay"
              class="flex items-center space-x-2"
            >
              <i class="icon-svg:alipay w-20px h-20px" />
              <div>支付宝</div>
            </div>
          </template>
          <ADescriptions
            :column="2"
            class="h-120px"
          >
            <ADescriptionsItem
              label="账单编号"
              :span="2"
            >
              {{ item.batchId }}
            </ADescriptionsItem>
            <ADescriptionsItem label="账单类型">
              {{ TransactionChannelDict.get(item.batch.channel) }}
            </ADescriptionsItem>
            <ADescriptionsItem label="交易次数">
              {{ item.batch.count }}
            </ADescriptionsItem>
            <ADescriptionsItem label="收入总额">
              <span v-currency:[item.batch.inAmount] />
            </ADescriptionsItem>
            <ADescriptionsItem label="支出总额">
              <span v-currency:[item.batch.outAmount] />
            </ADescriptionsItem>
            <ADescriptionsItem label="开始时间">
              {{ dayjs(item.batch.startTime).format('YYYY-MM-DD HH:mm:ss') }}
            </ADescriptionsItem>
            <ADescriptionsItem label="结束时间">
              {{ dayjs(item.batch.endTime).format('YYYY-MM-DD HH:mm:ss') }}
            </ADescriptionsItem>
          </ADescriptions>
        </ATabPane>
      </ATabs>
    </ACard>
  </div>
</template>

<script setup lang="ts">
import { sum } from 'radash'
import { TransactionChannelEnum } from '~/drizzle/schemas'

const { copy } = useClipboard({ legacy: true })
const store = useStore()
const dayjs = useDayjs()

function onCopy(value: string) {
  copy(value)
  Message.success('复制成功')
}

const data = computed(() => ({
  count: sum(store!.record!.batches, x => x.batch.count),
  inAmount: sum(store!.record!.batches, x => x.batch.inAmount),
  outAmount: sum(store!.record!.batches, x => x.batch.outAmount),
  startTime: dayjs.min(store!.record!.batches.map(x => dayjs(x.batch.startTime))),
  endTime: dayjs.min(store!.record!.batches.map(x => dayjs(x.batch.endTime))),
}))
</script>

<style scoped>

</style>
