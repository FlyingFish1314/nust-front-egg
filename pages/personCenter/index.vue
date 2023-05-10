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

const blobToString = (blob: any): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      console.log(reader.result)
      const ret = (reader.result as string)
        .split('')
        .map((v: any) => v.charCodeAt())
        .map((v: any) => v.toString(16).toUpperCase())
        .join(' ')
      resolve(ret)
    }
    reader.readAsBinaryString(blob)
  })
}

const isGif = async (file: any) => {
  // console.log('🚀 ~ file: index.vue:35 ~ isGif ~ file:', file)
  // 前面6个16进制 47 49 46 38 39 61  ||  47 49 46 38 37 61
  const ret = await blobToString(file.slice(0, 6))
  const isGif = ret === '47 49 46 38 39 61' || ret === '47 49 46 38 37 61'
  return isGif
}

const isPng = async (file: any) => {
  const ret = await blobToString(file.slice(0, 8))
  console.log('🚀 ~ file: index.vue:60 ~ isPng ~ ret:', ret)
  const isPng = ret === '89 50 4E 47 D A 1A A'
  return isPng
}
const isJpg = async (file: any) => {
  const len = file.size
  const start = await blobToString(file.slice(0, 2))
  const tail = await blobToString(file.slice(-2, len))
  const isJpg = start === 'FF D8' && tail === 'FF D9'
  return isJpg
}

const isImage = async (file: any) => {
  // 通过文件流来判定
  return (await isGif(file)) || (await isPng(file)) || (await isJpg(file))
}

const handleUpload = async () => {
  if (file.value) {
    if (!(await isImage(file.value))) {
      alert('文件格式不对')
      return
    }

    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('name', 'file')
    // send formData to server
    const config = {
      data: formData,
      onUploadProgress: (progressEvent: any) => {
        uploadProgress.value = Number(
          ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
        )
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
