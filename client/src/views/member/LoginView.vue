<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

function handleGoBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

function getRedirectTarget() {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }
  return { name: 'member' }
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = '請輸入電子郵件與密碼'
    return
  }

  isSubmitting.value = true
  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })
    await router.replace(getRedirectTarget())
  } catch (err) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      errorMessage.value = err.response?.data?.message || '登入失敗，請稍後再試'
    } else {
      errorMessage.value = '登入失敗，請稍後再試'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-8 sm:py-12">
    <form
      class="w-full max-w-md overflow-hidden rounded-[28px] border-2 border-neutral-800 bg-white shadow-[0_12px_30px_rgba(255,97,68,0.12)]"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <div
        class="flex items-center border-b-2 border-neutral-800 bg-brand-coral px-5 py-4 text-white sm:px-6"
      >
        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/15"
          aria-label="返回上一頁"
          @click="handleGoBack"
        >
          <img :src="asset('goback.png')" alt="返回" class="h-7 w-7 object-contain" />
        </button>
        <h1 class="flex-1 text-center text-xl font-extrabold tracking-wide sm:text-2xl">
          登入 / 註冊
        </h1>
        <span class="w-10" aria-hidden="true"></span>
      </div>

      <div class="p-6 sm:p-9">
        <p class="mb-6 text-center text-lg font-bold text-neutral-800 sm:text-xl">登入帳號密碼</p>

        <div
          v-if="errorMessage"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div class="mb-4">
          <label for="login-email" class="sr-only">電子郵件</label>
          <input
            id="login-email"
            v-model.trim="email"
            type="email"
            class="h-12 w-full rounded-2xl border-2 border-neutral-800 px-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
            placeholder="請輸入 Email"
            autocomplete="email"
            required
          />
        </div>

        <div class="relative mb-6">
          <label for="login-password" class="sr-only">密碼</label>
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="h-12 w-full rounded-2xl border-2 border-neutral-800 pr-12 pl-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
            placeholder="請輸入密碼"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer p-1 text-neutral-500 transition hover:text-brand-coral"
            :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="h-5 w-5" />
            <Eye v-else class="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          class="h-13 w-full cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow text-lg font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '登入中...' : '登入' }}
        </button>

        <div class="mt-6 flex items-center justify-center gap-2 text-sm sm:text-base">
          <span class="text-neutral-500">還沒有帳號嗎？</span>
          <RouterLink
            class="font-bold text-brand-coral hover:underline"
            :to="{ name: 'register', query: route.query }"
          >
            註冊
          </RouterLink>
        </div>
      </div>
    </form>
  </main>
</template>
