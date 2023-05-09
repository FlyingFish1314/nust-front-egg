<template>
  <div>404 Page slug={{ slug }}</div>
</template>
<script lang="ts" setup>
const route = useRoute()
const { slug } = route.params
</script>
<style scoped></style>
