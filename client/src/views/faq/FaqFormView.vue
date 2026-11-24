<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = new Date().toISOString().slice(0, 10)

const form = ref({
  applicationDate: today,
  name: authStore.user?.name ?? '',
  phone: authStore.user?.phone ?? '',
  email: authStore.user?.email ?? '',
  remark: '',
})

const errorMessage = ref('')
const isSubmitted = ref(false)

function handleSubmit() {
  errorMessage.value = ''
  isSubmitted.value = false

  if (!form.value.applicationDate) {
    errorMessage.value = '請選擇申請日期'
    return
  }

  if (!form.value.name.trim()) {
    errorMessage.value = '請填寫您的姓名'
    return
  }

  if (!form.value.phone.trim()) {
    errorMessage.value = '請填寫聯絡電話'
    return
  }

  if (!EMAIL_REGEX.test(form.value.email.trim())) {
    errorMessage.value = '請填寫有效的電子信箱'
    return
  }

  if (!form.value.remark.trim()) {
    errorMessage.value = '請描述您遇到的問題'
    return
  }

  // 後續可串接後端 POST /api/faq/form 寫入資料庫或寄送通知信
  isSubmitted.value = true
  form.value.remark = ''
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6">
        <RouterLink
          :to="{ name: 'faq' }"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 transition hover:text-brand-coral"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>返回常見問題</span>
        </RouterLink>
      </div>

      <div class="mb-8 text-center">
        <h1 class="text-3xl font-black text-neutral-900 sm:text-4xl">聯絡客服信箱</h1>
        <p class="mt-2 text-sm text-neutral-500 sm:text-base">
          填寫以下表單，我們將儘快透過電子信箱或電話回覆您
        </p>
      </div>

      <form
        class="space-y-5 rounded-3xl border-2 border-neutral-800 bg-white p-6 shadow-xs sm:p-8"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <div
          v-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="isSubmitted"
          class="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
          role="status"
        >
          <CheckCircle2 class="h-5 w-5 shrink-0 text-emerald-600" />
          <span>表單已送出！感謝您的回饋，我們會儘快與您聯繫。</span>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="faq-date" class="mb-1.5 block text-sm font-bold text-neutral-700">
              申請日期 *
            </label>
            <input
              id="faq-date"
              v-model="form.applicationDate"
              type="date"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
              required
            />
          </div>

          <div>
            <label for="faq-name" class="mb-1.5 block text-sm font-bold text-neutral-700">
              姓名 *
            </label>
            <input
              id="faq-name"
              v-model.trim="form.name"
              type="text"
              placeholder="怎麼稱呼您"
              autocomplete="name"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="faq-phone" class="mb-1.5 block text-sm font-bold text-neutral-700">
              電話 *
            </label>
            <input
              id="faq-phone"
              v-model.trim="form.phone"
              type="tel"
              placeholder="請輸入您的電話"
              autocomplete="tel"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
              required
            />
          </div>

          <div>
            <label for="faq-email" class="mb-1.5 block text-sm font-bold text-neutral-700">
              電子信箱 *
            </label>
            <input
              id="faq-email"
              v-model.trim="form.email"
              type="email"
              placeholder="name@example.com"
              autocomplete="email"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
              required
            />
          </div>
        </div>

        <div>
          <label for="faq-remark" class="mb-1.5 block text-sm font-bold text-neutral-700">
            請描述您遇到的問題 *
          </label>
          <textarea
            id="faq-remark"
            v-model.trim="form.remark"
            rows="6"
            placeholder="請詳細說明您的疑問或訂單資訊，方便客服快速協助您..."
            class="w-full rounded-2xl border-2 border-neutral-800 p-3.5 text-sm outline-none focus:border-brand-coral sm:text-base"
            required
          ></textarea>
        </div>

        <div class="flex justify-center pt-2">
          <button
            type="submit"
            class="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-coral px-10 text-lg font-extrabold text-white transition hover:bg-brand-yellow hover:text-neutral-900 sm:w-auto"
          >
            <Send class="h-5 w-5" />
            <span>送出表單</span>
          </button>
        </div>
      </form>
    </main>

    <AppFooter />
  </div>
</template>
