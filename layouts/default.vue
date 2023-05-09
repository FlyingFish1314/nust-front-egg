<template>
  <div class="layout">
    <div class="header">
      <headerLayout></headerLayout>
      <div>
        <NuxtLink to="/">
          <button>Home |</button>
        </NuxtLink>

        <NuxtLink to="/login">
          <button>login</button>
        </NuxtLink>
      </div>
    </div>
    <!-- 页面的内容 -->
    <slot></slot>
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

.footer {
  text-align: center;
}
</style>
