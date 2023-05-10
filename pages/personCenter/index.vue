<template>
  <div>
    <h1></h1>
    <div>
      <input ref="fileInput" type="file" @change="handleFileChange" />
      <button @click="handleUpload">Upload</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUserInfo, uploadFile } from '@/service/user'
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const handleUpload = async () => {
  if (file.value) {
    console.log(file.value)

    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('name', 'file')
    // send formData to server
    const res = await uploadFile(formData)
    console.log('🚀 ~ file: index.vue:31 ~ handleUpload ~ res:', res)
  }
}

onMounted(async () => {
  const result = await getUserInfo()
  console.log(result)
})
</script>
<style lang="scss" scoped></style>
