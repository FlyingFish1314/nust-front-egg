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
    <div>
      <p>网格的总进度</p>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="uploadProgressComputed"
      />
    </div>

    <div>
      <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
        <!-- progress <0 报错显示红色 ===100 成功显示绿色 彼得数字：显示高度 -->
        <div v-for="chunk in chunks" :key="chunk.name" class="cube">
          <div
            :class="{
              uploading: chunk.progress > 0 && chunk.progress < 100,
              success: chunk.progress === 100,
              error: chunk.progress < 0
            }"
            :style="{ height: chunk.progress + '%' }"
          >
            <el-icon
              v-if="chunk.progress < 100 && chunk.progress > 0"
              class="is-loading"
            >
              <Loading />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <pre>
      {{ chunks }}
    </pre>
  </div>
</template>

<script lang="ts" setup>
import { AnyAaaaRecord } from 'dns'
import sparkMD5 from 'spark-md5'
import { getUserInfo, uploadFile, mergeFile, checkFile } from '@/service/user'
const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const drag = ref<HTMLDivElement | null>(null)
const uploadProgress = ref(0)
const chunks = ref<Array<any>>([])
const hash = ref<any>('')
const cubeWidth = computed(() => {
  console.log(2)

  return Math.ceil(Math.sqrt(chunks.value.length)) * 16
})
const uploadProgressComputed = computed(() => {
  if (!file.value || chunks.value.length === 0) {
    return 0
  }
  const loaded = chunks.value
    .map((item) => {
      return item.chunk?.size * item.progress
    })
    .reduce((acc, cur) => acc + cur, 0)
  const num = Number((loaded / file.value.size).toFixed(2))
  return num
})
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
const createFileChunk = (size = CHUNK_SIZE) => {
  const chunks = []
  let cur = 0
  while (cur < (file.value as any).size) {
    chunks.push({ index: cur, file: file.value?.slice(cur, cur + size) })
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
          spark.append(e.target?.result as any)
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

const calculateHashSample = function () {
  return new Promise((resolve) => {
    const spark = new sparkMD5.ArrayBuffer()
    const reader = new FileReader()

    const size = (file.value as any).size
    const offset = 2 * 1024 * 1024
    // 第一个为2M,最后一个区块数据全要
    const chunks = [file.value?.slice(0, offset)]

    let cur = offset
    while (cur < size) {
      if (cur + offset >= size) {
        // 最后一个区块
        chunks.push(file.value?.slice(cur, cur + offset))
      } else {
        // 中间区块
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.value?.slice(cur, cur + 2))
        chunks.push(file.value?.slice(cur, mid + 2))
        chunks.push(file.value?.slice(end - 2, end))
      }
      cur += offset
    }
    // 中间的，去前中后个两个字节
    reader.readAsArrayBuffer(new Blob(chunks as any))
    reader.onload = (e: any) => {
      spark.append(e.target?.result)
      hashProgress.value = 100
      resolve(spark.end())
    }
  })
}

const handleUpload = async () => {
  if (file.value) {
    // if (!(await isImage(file.value))) {
    //   alert('文件格式不对')
    //   return
    // }
    chunks.value = createFileChunk()
    console.log(
      '🚀 ~ file: index.vue:249 ~ handleUpload ~  chunks.value:',
      chunks.value
    )
    // const hash = await calculateHashWorker(chunks)
    // console.log('🚀 ~ file: index.vue:125 ~ handleUpload ~ hash:', hash)
    const hash1 = await caluateHashIdle(chunks.value)
    hash.value = hash1
    // console.log('🚀 ~ file: index.vue:127 ~ handleUpload ~ hash1:', hash1)

    // 询问后端，文件是否上传过，如果没有，是否有存在的切片
    const res: any = await checkFile({
      data: {
        hash: hash.value,
        ext: (file.value?.name as string)?.split('.').pop()
      }
    })
    console.log('🚀 ~ file: index.vue:266 ~ handleUpload ~ res:', res)
    const { uploaded, uploadList } = res?.data
    if (uploaded) {
      console.log('秒传成功')
      return
    }
    // const hash2 = await calculateHashSample()
    chunks.value = chunks.value.map((chunk, index) => {
      // 切片的名字 hash + index
      const name = hash.value + '-' + index
      return {
        hash: hash.value,
        name,
        index,
        chunk: chunk.file,
        progress: uploadList.includes(name) ? 100 : 0
      }
    })

    await uploadChunks(uploadList)

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

const uploadChunks = async (uploadList = []) => {
  console.log(chunks.value)
  const requests = chunks.value
    .filter((chunk) => {
      return !uploadList.includes(chunk?.name as never)
    })
    .map((chunk: any) => {
      const form = new FormData()
      form.append('chunk', chunk.chunk)
      form.append('hash', chunk.hash)
      form.append('name', chunk.name)
      return { form, index: chunk.index, error: 0 }
    })
  // .map(({ form, index }) => {
  //   const config = {
  //     data: form,
  //     onUploadProgress: (progressEvent: any) => {
  //       // 不是整体的进度条了，而是每个区块有自己的进度条，怎提的进度条需要计算
  //       chunks.value[index].progress = Number(
  //         ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
  //       )
  //     }
  //   }
  //   return uploadFile(config)
  // })

  // @todo 并发量控制
  // 尝试申请tcp连接过多，也会造成卡顿
  // 异步并发数控制
  // await Promise.all(requests)
  await sendRequest(requests, 2)
  console.log('🚀 ~ file: index.vue:350 ~ uploadChunks ~ requests:', requests)
  const res = await mergeFile({
    data: {
      ext: (file.value?.name as string)?.split('.').pop(),
      size: CHUNK_SIZE,
      hash: hash.value
    }
  })
  console.log('🚀 ~ file: index.vue:321 ~ uploadChunks ~ res:', res)
}
// 上传可能报错，报错之后，进度条变红，开始重试，一个切片重试失败三次，整体全部中止
const sendRequest = (requests: any, limit = 4) => {
  // limit并发数
  // 一个数组，长度为limit
  return new Promise((resolve, reject) => {
    const len = requests.length
    let count = 0
    let isStop = false
    const start = async () => {
      if (isStop) return
      const task = requests.shift()
      if (task) {
        const { form, index } = task
        const config = {
          data: form,
          onUploadProgress: (progressEvent: any) => {
            // 不是整体的进度条了，而是每个区块有自己的进度条，怎提的进度条需要计算
            console.log(
              '🚀 ~ file: index.vue:368 ~ start ~  chunks.value:',
              chunks.value
            )
            chunks.value[index].progress = Number(
              ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
            )
          }
        }
        const res = await uploadFile(config)
        console.log('🚀 ~ file: index.vue:372 ~ start ~ res:', res.code === 0)
        if (res.code !== 0) {
          chunks.value[index].progress = -1
          if (task.error < 3) {
            task.error++
            requests.unshift(task)
            start()
          } else {
            reject(-1)
            isStop = true
          }
        } else if (count === len - 1) {
          resolve(null)
        } else {
          count++
          start()
        }
      }
    }
    while (limit > 0) {
      start()
      limit -= 1
    }
  })
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
    // console.log(fileList)
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
.cube-container {
  .cube {
    width: 14px;
    height: 14px;
    line-height: 12px;
    border: 1px black solid;
    background: #eee;
    float: left;
    .success {
      background-color: green;
    }
    .uploading {
      background-color: rgb(12, 131, 228);
    }
    .error {
      background-color: red;
    }
  }
}
</style>
