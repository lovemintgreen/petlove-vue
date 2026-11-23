<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (newPassword.value.length < 8) {
    errorMessage.value = '密碼必須至少 8 個字元'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '兩次輸入的密碼不一致'
    return
  }

  // 後續串接 PATCH /api/member/password 更新雜湊密碼
  newPassword.value = ''
  confirmPassword.value = ''
  successMessage.value = '密碼驗證通過（待串接後端更新密碼 API）'
}
</script>

<template>
  <div class="max-w-xl">
    <h1 class="mb-2 text-2xl font-black text-neutral-900">密碼設定</h1>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div
        class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-center text-lg font-extrabold"
      >
        更改密碼
      </div>

      <form class="space-y-5 p-6" @submit.prevent="handleSubmit" novalidate>
        <div
          v-if="errorMessage"
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800"
        >
          {{ successMessage }}
        </div>

        <div>
          <label for="new-password" class="mb-1.5 block text-sm font-bold text-neutral-700">
            輸入新密碼
          </label>
          <div class="relative">
            <input
              id="new-password"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="請輸入最少 8 個字元"
              autocomplete="new-password"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 pr-12 pl-4 text-base outline-none focus:border-brand-coral"
              required
            />
            <button
              type="button"
              class="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer p-1 text-neutral-500 hover:text-brand-coral"
              :aria-label="showNewPassword ? '隱藏密碼' : '顯示密碼'"
              @click="showNewPassword = !showNewPassword"
            >
              <EyeOff v-if="showNewPassword" class="h-5 w-5" />
              <Eye v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label for="confirm-password" class="mb-1.5 block text-sm font-bold text-neutral-700">
            確認密碼
          </label>
          <div class="relative">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="請再次輸入密碼"
              autocomplete="new-password"
              class="h-12 w-full rounded-2xl border-2 border-neutral-800 pr-12 pl-4 text-base outline-none focus:border-brand-coral"
              required
            />
            <button
              type="button"
              class="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer p-1 text-neutral-500 hover:text-brand-coral"
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
          class="h-12 w-full cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow text-base font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        >
          更改確認
        </button>
      </form>
    </section>
  </div>
</template>
