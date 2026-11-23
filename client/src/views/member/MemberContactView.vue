<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Send } from 'lucide-vue-next'

const props = defineProps<{
  role: 'nanny' | 'guest'
}>()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const isNannyView = computed(() => props.role === 'nanny')
const backRoute = computed(() => (isNannyView.value ? '/member/request' : '/member/mission'))
const counterpartLabel = computed(() => (isNannyView.value ? '保母名稱' : '客戶名稱'))
const counterpartName = computed(() => (isNannyView.value ? '愛遛狗的小姊姊' : '王小明'))

const orderInfo = ref({
  orderCode: '#123',
  dateTime: '2026-11-25 14:00',
  duration: '60 分鐘',
  frequency: '一天 2 次',
  days: '2 天',
  location: '台中市南屯區',
  note: '請幫忙多注意補水，謝謝！',
})

const newMessage = ref('')
const messages = ref<string[]>([])

function handleSubmit() {
  const trimmed = newMessage.value.trim()
  if (!trimmed) return

  // 後續串接 /api/member/contact-nanny 或 /api/member/contact-guest
  messages.value.unshift(trimmed)
  orderInfo.value.note = trimmed
  newMessage.value = ''
}
</script>

<template>
  <div class="max-w-5xl">
    <div class="mb-2 flex items-center justify-between gap-2">
      <h1 class="text-2xl font-black text-neutral-900">
        {{ isNannyView ? '聯絡保姆' : '聯絡飼主' }}
      </h1>
      <RouterLink :to="backRoute" class="text-sm font-bold text-brand-coral hover:underline">
        ← 返回列表
      </RouterLink>
    </div>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 訂單資訊卡 -->
      <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
        <div class="flex items-center gap-3.5 border-b-2 border-neutral-800 bg-brand-yellow px-5 py-4">
          <img
            :src="imgAsset('girl with dog.jpg')"
            :alt="counterpartName"
            class="h-14 w-14 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p class="text-xs font-bold text-neutral-700">{{ counterpartLabel }}</p>
            <p class="text-lg font-black text-neutral-900">{{ counterpartName }}</p>
          </div>
        </div>

        <div class="p-5">
          <h2 class="mb-3 text-base font-extrabold text-neutral-900">訂單資訊</h2>
          <ul class="divide-y divide-neutral-200 text-sm sm:text-base">
            <li class="flex justify-between gap-3 py-2.5">
              <span class="text-neutral-500">1. 日期與時間</span>
              <span class="font-semibold text-neutral-900">{{ orderInfo.dateTime }}</span>
            </li>
            <li class="flex justify-between gap-3 py-2.5">
              <span class="text-neutral-500">2. 服務時間</span>
              <span class="font-semibold text-neutral-900">{{ orderInfo.duration }}</span>
            </li>
            <li class="flex justify-between gap-3 py-2.5">
              <span class="text-neutral-500">3. 頻率</span>
              <span class="font-semibold text-neutral-900">{{ orderInfo.frequency }}</span>
            </li>
            <li class="flex justify-between gap-3 py-2.5">
              <span class="text-neutral-500">4. 所需天數</span>
              <span class="font-semibold text-neutral-900">{{ orderInfo.days }}</span>
            </li>
            <li class="flex justify-between gap-3 py-2.5">
              <span class="text-neutral-500">5. 地點</span>
              <span class="font-semibold text-neutral-900">{{ orderInfo.location }}</span>
            </li>
            <li class="flex justify-between gap-3 py-2.5">
              <span class="shrink-0 text-neutral-500">其他要求</span>
              <span class="text-right font-semibold text-neutral-900">{{ orderInfo.note }}</span>
            </li>
            <li class="flex justify-between gap-3 pt-3 font-extrabold text-brand-coral">
              <span>訂單編號</span>
              <span>{{ orderInfo.orderCode }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 留言板 -->
      <section class="rounded-3xl border-2 border-neutral-800 bg-white p-5 sm:p-6">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="contact-message" class="mb-1.5 block text-base font-extrabold text-neutral-900">
              留言板
            </label>
            <textarea
              id="contact-message"
              v-model.trim="newMessage"
              rows="4"
              required
              placeholder="輸入要傳送給對方的訊息或補充要求..."
              class="w-full rounded-2xl border-2 border-neutral-800 p-3.5 text-sm outline-none focus:border-brand-coral sm:text-base"
            ></textarea>
          </div>
          <button
            type="submit"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          >
            <Send class="h-4 w-4" />
            <span>提交留言</span>
          </button>
        </form>

        <div class="my-5 h-0.5 bg-brand-coral/70"></div>

        <p v-if="messages.length === 0" class="text-sm text-neutral-400">
          尚未送出新留言
        </p>
        <ul v-else class="space-y-2.5">
          <li
            v-for="(msg, index) in messages"
            :key="`${msg}-${index}`"
            class="rounded-2xl bg-brand-warm px-4 py-3 text-sm font-medium text-neutral-800"
          >
            {{ msg }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
