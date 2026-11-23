<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <main>
    <h1>會員中心</h1>
    <p v-if="authStore.user">歡迎，{{ authStore.user.name }}（{{ authStore.user.email }}）</p>
  </main>
</template>
