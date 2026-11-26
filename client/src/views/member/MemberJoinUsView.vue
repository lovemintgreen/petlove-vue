<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

// 頂部橫幅打字機動畫目標文字與目前顯示片段
const fullTitle = '成為寵樂的服務夥伴'
const typedTitle = ref('')

const benefits = [
  '自由選擇您的計劃、服務和報價',
  '您的服務將被分配給附近的寵物父母',
  '我們將替您管理寵物家長的預訂和要求',
  '簡單可靠的支付系統',
]

const requirements = [
  '以友好和專業的方式親自交付您承諾的服務',
  '快速和專業的回應（24 小時以內）客戶的諮詢和預訂請求',
  '保持活躍和您的帳戶更新',
  '確認您在法律上能夠在您所在的司法轄區提供寵物服務',
]

let timer: ReturnType<typeof setInterval> | null = null

// 掛載後每 140ms 逐字顯示標題，完成或離開頁面時清除計時器
onMounted(() => {
  let index = 0
  timer = setInterval(() => {
    index += 1
    typedTitle.value = fullTitle.slice(0, index)
    if (index >= fullTitle.length && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 140)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="max-w-4xl space-y-8">
    <!-- 頂部橫幅 -->
    <div class="relative overflow-hidden rounded-3xl border-2 border-neutral-800">
      <img
        :src="imgAsset('terms.jpg')"
        alt="成為寵樂服務夥伴"
        class="h-52 w-full object-cover sm:h-72"
      />
      <div class="absolute inset-0 flex items-center justify-center bg-black/40 px-4 text-center">
        <h1 class="text-2xl font-black tracking-wide text-white drop-shadow sm:text-4xl">
          {{ typedTitle }}<span class="animate-pulse">|</span>
        </h1>
      </div>
    </div>

    <!-- 優勢卡片 -->
    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div class="border-b-2 border-neutral-800 bg-brand-coral px-5 py-3 text-lg font-extrabold text-white">
        作為寵樂夥伴的優勢
      </div>
      <ul class="list-disc space-y-2.5 py-5 pr-6 pl-10 text-sm text-neutral-800 sm:text-base">
        <li v-for="item in benefits" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- 規範卡片 -->
    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div class="border-b-2 border-neutral-800 bg-brand-coral px-5 py-3 text-lg font-extrabold text-white">
        一旦與我們合作成為保姆，你必須：
      </div>
      <ul class="list-disc space-y-2.5 py-5 pr-6 pl-10 text-sm text-neutral-800 sm:text-base">
        <li v-for="item in requirements" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- 申請入口按鈕 -->
    <div class="flex flex-col gap-4 sm:flex-row">
      <RouterLink
        to="/member/become-nanny"
        class="inline-flex h-14 flex-1 items-center justify-center rounded-full border-2 border-neutral-800 bg-brand-yellow px-8 text-base font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
      >
        成為保姆夥伴
      </RouterLink>
      <RouterLink
        to="/member/become-walker"
        class="inline-flex h-14 flex-1 items-center justify-center rounded-full border-2 border-neutral-800 bg-white px-8 text-base font-extrabold text-neutral-900 transition hover:bg-brand-yellow"
      >
        成為代遛幫手
      </RouterLink>
    </div>
  </div>
</template>
