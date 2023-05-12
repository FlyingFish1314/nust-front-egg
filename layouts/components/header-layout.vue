<template>
  <div class="demo-color-block">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/personCenter">个人中心</el-menu-item>
      <el-menu-item index="/login">登录</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const router = useRouter()
const activeIndex = ref('/')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  router.push(key)
}
</script>

<style lang="scss" scope>
.demo-color-block {
  // width: 1150px;
  margin: 0 auto;
  .flex-grow {
    flex-grow: 1;
  }
}
</style>
