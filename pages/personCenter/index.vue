<template>
  <div>用户中心</div>
</template>

<script lang="ts" setup>
import { getUserInfo } from '@/service/user'

onMounted(async () => {
  const result = await getUserInfo()
  console.log(result)
})
</script>
<style lang="scss" scoped></style>
