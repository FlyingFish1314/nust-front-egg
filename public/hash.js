// 引入spark-md5
importScripts('spark-md5.min.js')

self.onmessage = e => {
  // 接收主线程传递的数据
  const { chunks } = e.data
  const spark = new SparkMD5.ArrayBuffer()

  let progress = 0
  let count = 0

  const loadNext = index => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunks[index].file)
    reader.onload = e => {
      count++
      spark.append(e.target.result)

      if (count === chunks.length) {
        self.postMessage({
          progress: 100,
          hash: spark.end()
        })
      } else {
        progress += 100 / chunks.length
        self.postMessage({
          progress
        })
        loadNext(count)

      }
    }
  }
  if (chunks) {

    loadNext(0)
  }
}

