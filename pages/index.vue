<template>
  <input type="file" @input="handleFileInput" />
  <button @click="submit">submit</button>
</template>

<script setup lang="ts">
 const { handleFileInput, files } = useFileStorage()

 const submit = async () => {
    const response = await $fetch('/api/files', {
        method: 'POST',
        body: {
            files: files.value
        }
    })
}
</script>

<style scoped>

</style>