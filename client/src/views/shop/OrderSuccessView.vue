<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CheckCircle2 } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()

const countdown = ref(5)
const orderNo = computed(() =>
  typeof route.query.orderNo === 'string' && route.query.orderNo ? route.query.orderNo : '',
)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      router.replace({ name: 'home' })
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 py-14 text-center sm:py-20">
      <div
        class="w-full rounded-3xl border-2 border-neutral-800 bg-white p-8 shadow-[0_12px_30px_rgba(255,97,68,0.12)] sm:p-10"
      >
        <CheckCircle2 class="mx-auto mb-4 h-16 w-16 text-emerald-500" />
        <h1 class="text-2xl font-black text-neutral-900 sm:text-3xl">訂單送出成功！</h1>
        <p v-if="orderNo" class="mt-2 text-sm font-bold text-brand-coral sm:text-base">
          訂單編號：#{{ orderNo }}
        </p>

        <img
          src="https://media.istockphoto.com/id/1325997570/photo/bengal-cat-lying-on-sofa-and-smiling.webp?a=1&b=1&s=612x612&w=0&k=20&c=taQuQSqSHLLYI5svzRUrLqO73SdKilVthO_8gABtTD4="
          alt="訂單完成感謝毛孩插圖"
          class="mx-auto my-6 h-56 w-56 rounded-3xl border-2 border-brand-yellow object-cover"
        />

        <p class="text-base font-bold text-neutral-700">
          將在 <span class="text-xl font-black text-brand-coral">{{ countdown }}</span> 秒內導回首頁...
        </p>

        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <RouterLink
            :to="{ name: 'home' }"
            class="rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          >
            立即回首頁
          </RouterLink>
          <RouterLink
            to="/member/history"
            class="rounded-full border-2 border-neutral-800 bg-white px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-warm"
          >
            查看訂單記錄
          </RouterLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
