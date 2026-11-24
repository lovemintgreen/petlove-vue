<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Mail } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

interface FaqItem {
  question: string
  answer?: string
  steps?: string[]
}

interface FaqSection {
  id: string
  title: string
  items: FaqItem[]
}

const faqSections: FaqSection[] = [
  {
    id: 'getting-started',
    title: '如何開始',
    items: [
      {
        question: '寵樂是什麼',
        answer:
          '寵樂提供配對服務，使毛孩主人可以輕鬆找到離家最近、最優惠的價格，以及最值得信任的保姆。',
      },
      {
        question: '我的寵物適合用寵樂嗎',
        answer: '若您的寵物有攻擊性，不建議使用寵樂平台。',
      },
    ],
  },
  {
    id: 'booking',
    title: '預定照顧和家庭拜訪',
    items: [
      {
        question: '怎麼對保姆留評論或評分',
        answer: '當該次服務結束後即可留下評論或評分。',
      },
      {
        question: '怎麼取消預訂和收到退款',
        answer:
          '如果您在預訂的服務期間之前或期間取消預訂，我們將根據服務供應商在寵樂平台服務中選擇的取消時間退還費用。',
      },
    ],
  },
  {
    id: 'payment',
    title: '付款',
    items: [
      {
        question: '怎麼付款預訂',
        steps: [
          '與保姆聯繫確定服務合適',
          '於訊息內點擊訂單，或點選「訂單」圖示後找到該訂單',
          '點擊「立即付款」付款並確定預約',
        ],
      },
      {
        question: '有哪些付款方式',
        answer: '線上信用卡付款、轉帳付款（需要與保姆索取平台匯款資料）。',
      },
    ],
  },
]

const openSectionIds = ref<string[]>(faqSections.map((section) => section.id))

function toggleSection(id: string) {
  if (openSectionIds.value.includes(id)) {
    openSectionIds.value = openSectionIds.value.filter((item) => item !== id)
  } else {
    openSectionIds.value = [...openSectionIds.value, id]
  }
}

function isSectionOpen(id: string): boolean {
  return openSectionIds.value.includes(id)
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 text-center sm:mb-10">
        <h1 class="text-3xl font-black text-neutral-900 sm:text-4xl">常見問題</h1>
        <p class="mt-2 text-sm text-neutral-500 sm:text-base">
          快速了解寵樂的服務流程、預約方式與付款說明
        </p>
      </div>

      <!-- 手風琴區塊 -->
      <div class="space-y-5">
        <section
          v-for="section in faqSections"
          :key="section.id"
          class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xs"
        >
          <h2>
            <button
              type="button"
              class="flex w-full cursor-pointer items-center justify-between bg-brand-yellow px-5 py-4 text-left text-lg font-black text-neutral-900 transition hover:bg-brand-yellow/90 sm:px-6 sm:text-xl"
              :aria-expanded="isSectionOpen(section.id)"
              @click="toggleSection(section.id)"
            >
              <span>{{ section.title }}</span>
              <ChevronDown
                class="h-5 w-5 shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': isSectionOpen(section.id) }"
              />
            </button>
          </h2>

          <div
            v-show="isSectionOpen(section.id)"
            class="divide-y divide-neutral-200 border-t-2 border-neutral-800"
          >
            <div v-for="item in section.items" :key="item.question" class="px-5 py-5 sm:px-6">
              <h3 class="mb-2 text-base font-extrabold text-neutral-900 sm:text-lg">
                {{ item.question }}
              </h3>
              <p v-if="item.answer" class="pl-4 text-sm leading-relaxed text-neutral-700 sm:pl-6 sm:text-base">
                {{ item.answer }}
              </p>
              <ol
                v-if="item.steps"
                class="list-decimal space-y-1.5 pl-9 text-sm leading-relaxed text-neutral-700 sm:pl-11 sm:text-base"
              >
                <li v-for="step in item.steps" :key="step">{{ step }}</li>
              </ol>
            </div>
          </div>
        </section>
      </div>

      <!-- 聯絡我們 CTA -->
      <div
        class="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-brand-coral bg-brand-warm px-6 py-8 text-center sm:flex-row sm:gap-5"
      >
        <p class="text-xl font-black text-brand-coral sm:text-2xl">還有其他疑問嗎？歡迎</p>
        <RouterLink
          :to="{ name: 'faq-form' }"
          class="inline-flex items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-coral px-7 py-3 text-lg font-extrabold text-white transition hover:bg-brand-yellow hover:text-neutral-900"
        >
          <Mail class="h-5 w-5" />
          <span>聯絡我們</span>
        </RouterLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
