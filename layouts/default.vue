<template>
  <div class="layout">
    <div class="header">
      <headerLayout></headerLayout>
    </div>
    <!-- 页面的内容 -->
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">我是footer</div>
  </div>
</template>

<script lang="ts" setup>
import headerLayout from './components/header-layout.vue'
</script>
<style scoped>
.header {
  text-align: center;
}
.content {
  width: 80%;
  margin: 0 auto;
}
.footer {
  text-align: center;
}
</style>
