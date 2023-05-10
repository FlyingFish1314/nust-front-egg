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
    <div>
      <p>计算hash的进度worker</p>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="hashProgress"
      />
    </div>
    <div>
      <p>计算hash的进度</p>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="hashProgressIdele"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import sparkMD5 from 'spark-md5'
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

const CHUNK_SIZE = 0.5 * 1024 * 1024
const createFileChunk = (file: any, size = CHUNK_SIZE) => {
  const chunks = []
  let cur = 0
  while (cur < file.size) {
    chunks.push({ index: cur, file: file.slice(cur, cur * size) })
    cur += size
  }
  return chunks
}

const hashProgress = ref(0)
const calculateHashWorker = (chunks: any) => {
  return new Promise((resolve) => {
    const worker = new Worker('/hash.js')
    worker.postMessage({ chunks })
    worker.onmessage = (e) => {
      const { progress, hash } = e.data
      console.log(
        '🚀 ~ file: index.vue:103 ~ returnnewPromise ~ progress:',
        progress
      )
      hashProgress.value = Number((progress as number).toFixed(2))
      if (hash) {
        resolve(hash)
      }
    }
  })
}
const hashProgressIdele = ref(0)
const caluateHashIdle = (chunks: any) => {
  return new Promise((resolve) => {
    const spark = new sparkMD5.ArrayBuffer()
    let count = 0

    const appendToSpark = (file: any): Promise<void> => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          spark.append(e.target?.result)
          resolve()
        }
      })
    }
    const workLoop = async (deadLine: any) => {
      while (count < chunks.length && deadLine.timeRemaining() > 1) {
        // 空闲时间，且有任务
        await appendToSpark(chunks[count].file)
        count++
        if (count < chunks.length) {
          hashProgressIdele.value = Number(
            ((100 * count) / chunks.length).toFixed(2)
          )
        } else {
          hashProgressIdele.value = 100
          resolve(spark.end())
        }
      }
      window.requestIdleCallback(workLoop)
    }
    window.requestIdleCallback(workLoop)
  })
}

const handleUpload = async () => {
  if (file.value) {
    // if (!(await isImage(file.value))) {
    //   alert('文件格式不对')
    //   return
    // }
    const chunks = createFileChunk(file.value)
    const hash = await calculateHashWorker(chunks)
    console.log('🚀 ~ file: index.vue:125 ~ handleUpload ~ hash:', hash)
    const hash1 = await caluateHashIdle(chunks)
    console.log('🚀 ~ file: index.vue:127 ~ handleUpload ~ hash1:', hash1)
    // const formData = new FormData()
    // formData.append('file', file.value)
    // formData.append('name', 'file')
    // // send formData to server
    // const config = {
    //   data: formData,
    //   onUploadProgress: (progressEvent: any) => {
    //     uploadProgress.value = Number(
    //       ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
    //     )
    //   }
    // }
    // const res = await uploadFile(config)
    // console.log('🚀 ~ file: index.vue:31 ~ handleUpload ~ res:', res)
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
