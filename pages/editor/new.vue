<template>
  <div class="editor">
    <textarea
      ref="editor"
      class="input"
      :value="input"
      @input="update"
    ></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>

<script lang="ts" setup>
import { marked } from 'marked'
import { debounce } from 'lodash-es'
import { ref, computed } from 'vue'
import hljs from 'highlight.js'
// import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github-dark.css'

definePageMeta({
  layout: 'custom-layout'
})
const renderer = new marked.Renderer()

const editor = ref<HTMLDivElement | null>(null)

const input = ref('# hello')

const output = computed(() => marked(input.value))

const update = debounce((e) => {
  input.value = e.target.value
}, 100)

const bindEvents = function () {
  const editorDom = editor.value
  console.log(123)

  editorDom?.addEventListener('paste', (e: any) => {
    const files = e?.clipboardData.files
    console.log('🚀 ~ file: new.vue:45 ~ bindEvents ~ files:', files)
    // @todo 上传文件
  })

  editorDom?.addEventListener('drop', (e: any) => {
    const fileList = e.dataTransfer.files
    console.log(
      '🚀 ~ file: new.vue:41 ~ editorDom?.addEventListener ~ fileList:',
      fileList
    )
    editorDom.style.borderColor = '#eee'
    // @todo 上传文件
    e.preventDefault()
  })
}

onMounted(() => {
  bindEvents()
  marked.setOptions({
    renderer,
    highlight: (code: any) => {
      return hljs.highlightAuto(code).value
    }
  })
})
</script>
<style lang="scss" scoped>
body {
  margin: 0;
}

.editor {
  height: 100vh;
  display: flex;
}

.input,
.output {
  overflow: auto;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 1.25rem;
}

.input {
  border: none;
  border-right: 0.0625rem solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 0.875rem;
  font-family: 'Monaco', courier, monospace;
  padding: 1.25rem;
}

code {
  color: #f66;
}
</style>
