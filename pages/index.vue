<template>
  <div class="absolute inset-0 flex-center">
    <div class="space-y-20px">
      <div class="text-24px text-center">
        导入账单
      </div>
      <div class="flex space-x-30px">
        <div class="wxpay rounded-10px shadow h-200px w-200px flex-center relative">
          <div class="space-y-2 text-center">
            <i class="icon-park:wechat w-80px h-80px" />
            <div>微信支付</div>
          </div>
          <input
            class="absolute inset-0 opacity-0"
            type="file"
            @input="e => onUploadPDF('WxPay', e)"
          >
        </div>
        <div class="wxpay rounded-10px shadow h-200px w-200px flex-center relative">
          <div class="space-y-2 text-center">
            <i class="icon-park:alipay w-80px h-80px" />
            <div>微信支付</div>
          </div>
          <input
            class="absolute inset-0 opacity-0"
            type="file"
            @input="e => onUploadPDF('AliPay', e)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { handleFileInput, files } = useFileStorage()
let channel: 'AliPay' | 'WxPay'
function onUploadPDF(type: 'AliPay' | 'WxPay', event: Event) {
  channel = type
  return handleFileInput(event)
}

watch(() => files, async () => {
  if (files.value && files.value.length) {
    const [file] = files.value
    const batchNo = await $fetch('/api/import', {
      method: 'POST',
      body: {
        file,
        channel,
      },
    })
    console.log(batchNo)
  }
}, {
  deep: true,
})
</script>

<style scoped>

</style>
