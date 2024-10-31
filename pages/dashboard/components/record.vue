<template>
  <div class="flex">
    <ACard class="flex-center">
      <div class="flex space-x-10px font-bold">
        <ADescriptions
          :column="1"
          class="w-200px"
          layout="vertical"
          :value-style="{ fontWeight: 'bold' }"
        >
          <ADescriptionsItem label="姓名:">
            {{ store.record?.user.username }}
          </ADescriptionsItem>
          <ADescriptionsItem label="  身份证号:">
            {{ store.record?.user.id }}
          </ADescriptionsItem>
        </ADescriptions>
      </div>
    </ACard>
    <ACard class="flex-auto">
      <ATabs>
        <ATabPane
          v-for="item in store?.record?.batches"
          :key="item.batchId"
          class="shadow p-10px"
          :title="TransactionChannelDict.get(item.batch.channel)"
        >
          <ADescriptions :column="2">
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
              ¥{{ item.batch.inAmount/100 }}
            </ADescriptionsItem>
            <ADescriptionsItem label="支出总额">
              ¥{{ item.batch.outAmount/100 }}
            </ADescriptionsItem>
          </ADescriptions>
        </ATabPane>
      </ATabs>
    </ACard>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>

<style scoped>

</style>
