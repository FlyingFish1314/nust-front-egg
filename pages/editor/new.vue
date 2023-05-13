<template>
  <div class="editor">
    <div class="editor-header">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <!-- <div class="content">
    </div> -->
    <el-row :gutter="24">
      <el-col :span="12">
        <textarea class="md-editor" :value="input" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdownContent" v-html="output"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { marked } from 'marked'
import { debounce } from 'lodash-es'
definePageMeta({
  layout: 'custom-layout'
})
const submit = () => {}
const input = ref('# hello')
const output = computed(() => marked(input.value))

const update = debounce((e) => {
  input.value = e.target.value
}, 100)
</script>
<style lang="scss" scoped>
// .editor {
//   height: calc(100vh - 24px);
//   width: calc(100vh - 24px);
// }
// .element.style {
//   margin: none;
// }
.md-editor {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
