<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <headerLayout></headerLayout>
      </el-header>
      <el-main><slot></slot></el-main>
      <el-footer>Footer</el-footer>
    </el-container>
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
