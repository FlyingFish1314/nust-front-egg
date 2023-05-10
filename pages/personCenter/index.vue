<template>
  <div>
    <h1></h1>
    <div>
      <div id="drag" ref="drag">
        <input ref="fileInput" type="file" @change="handleFileChange" />
      </div>
      <div>
        <el-progress
          :stroke-width="20"
          :text-inside="true"
          :percentage="uploadProgress"
        />
      </div>
      <button @click="handleUpload">Upload</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUserInfo, uploadFile } from '@/service/user'
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const drag = ref<HTMLDivElement | null>(null)
const uploadProgress = ref(0)

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
    const config = {
      data: formData,
      onUploadProgress: (progressEvent: any) => {
        uploadProgress.value =
          ((progressEvent.loaded / progressEvent.total) * 100) | 0
      }
    }
    const res = await uploadFile(config)
    console.log('🚀 ~ file: index.vue:31 ~ handleUpload ~ res:', res)
  }
}

const bindEvents = function () {
  const dragDom = drag.value
  dragDom?.addEventListener('dragover', (e: any) => {
    dragDom.style.borderColor = 'red'
    e.preventDefault()
  })
  dragDom?.addEventListener('dragleave', (e: any) => {
    dragDom.style.borderColor = '#eee'
    e.preventDefault()
  })
  dragDom?.addEventListener('drop', (e: any) => {
    const fileList = e.dataTransfer.files
    console.log(fileList)
    dragDom.style.borderColor = '#eee'
    file.value = fileList[0]
    e.preventDefault()
  })
}

onMounted(async () => {
  const result = await getUserInfo()
  console.log(result)
  bindEvents()
})
</script>
<style lang="scss" scoped>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
  vertical-align: middle;
}
</style>
