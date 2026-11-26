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
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 註冊表單欄位與密碼顯示切換狀態
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

// 僅接受站內相對路徑作為註冊完成後的重導目標
function getRedirectTarget() {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }
  return { name: 'member' }
}

/**
 * 檢查會員名稱、Email、密碼長度與確認密碼後呼叫註冊 API
 */
async function handleSubmit() {
  errorMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = '請輸入會員名稱'
    return
  }

  if (!EMAIL_REGEX.test(email.value.trim())) {
    errorMessage.value = '請輸入有效的電子郵件'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密碼長度至少需 6 個字元'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '兩次輸入的密碼不一致'
    return
  }

  isSubmitting.value = true
  try {
    await authStore.register({
      name: name.value.trim(),
      phone: phone.value.trim() || undefined,
      email: email.value.trim(),
      password: password.value,
    })
    await router.replace(getRedirectTarget())
  } catch (err) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      errorMessage.value = err.response?.data?.message || '註冊失敗，請稍後再試'
    } else {
      errorMessage.value = '註冊失敗，請稍後再試'
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
        <RouterLink
          class="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15"
          :to="{ name: 'login', query: route.query }"
          aria-label="返回登入頁"
        >
          <img :src="asset('goback.png')" alt="返回" class="h-7 w-7 object-contain" />
        </RouterLink>
        <h1 class="flex-1 text-center text-xl font-extrabold tracking-wide sm:text-2xl">
          註冊會員
        </h1>
        <span class="w-10" aria-hidden="true"></span>
      </div>

      <div class="p-6 sm:p-9">
        <p class="mb-6 text-center text-lg font-bold text-neutral-800 sm:text-xl">註冊帳號密碼</p>

        <div
          v-if="errorMessage"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div class="space-y-3.5">
          <div>
            <label for="register-name" class="sr-only">會員名稱</label>
            <input
              id="register-name"
              v-model.trim="name"
              type="text"
              maxlength="20"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 px-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
              placeholder="請輸入您的會員名稱"
              autocomplete="name"
              required
            />
          </div>

          <div>
            <label for="register-phone" class="sr-only">手機號碼</label>
            <input
              id="register-phone"
              v-model.trim="phone"
              type="tel"
              maxlength="20"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 px-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
              placeholder="請輸入手機號碼（選填）"
              autocomplete="tel"
            />
          </div>

          <div>
            <label for="register-email" class="sr-only">電子郵件</label>
            <input
              id="register-email"
              v-model.trim="email"
              type="email"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 px-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
              placeholder="請輸入 Email"
              autocomplete="email"
              required
            />
          </div>

          <div class="relative">
            <label for="register-password" class="sr-only">密碼</label>
            <input
              id="register-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 pr-12 pl-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
              placeholder="請輸入密碼（至少 6 碼）"
              autocomplete="new-password"
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

          <div class="relative">
            <label for="register-confirm-password" class="sr-only">確認密碼</label>
            <input
              id="register-confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 pr-12 pl-4 text-base outline-none transition focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/20 sm:h-13"
              placeholder="請再次輸入密碼"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer p-1 text-neutral-500 transition hover:text-brand-coral"
              :aria-label="showConfirmPassword ? '隱藏確認密碼' : '顯示確認密碼'"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
              <Eye v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="mt-6 h-13 w-full cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow text-lg font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '註冊中...' : '註冊' }}
        </button>

        <div class="mt-6 flex items-center justify-center gap-2 text-sm sm:text-base">
          <span class="text-neutral-500">已經有帳號了嗎？</span>
          <RouterLink
            class="font-bold text-brand-coral hover:underline"
            :to="{ name: 'login', query: route.query }"
          >
            返回登入
          </RouterLink>
        </div>
      </div>
    </form>
  </main>
</template>
