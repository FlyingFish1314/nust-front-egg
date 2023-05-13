<template>
  <div>
    <pre>
      <code v-highlightjs class="javascript">
        {{ code }}
      </code>
    </pre>
  </div>
</template>

<script lang="ts" setup>
import highlight from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-subline.css'
const code = ref(`console.log('Hello World')`)
</script>

<style lang="scss" scoped></style>
