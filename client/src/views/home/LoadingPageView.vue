<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronsDown } from 'lucide-vue-next'

interface ShowcaseItem {
  image: string
  alt: string
  services?: string[]
}

const svgAsset = (filename: string) => `${import.meta.env.BASE_URL}svg/${filename}`

const marqueeText = '歡迎光臨寵樂！！ '.repeat(24)

const showcaseItems: ShowcaseItem[] = [
  {
    image:
      'https://images.unsplash.com/photo-1501472193205-56ffb66400f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHBldHN8ZW58MHx8MHx8fDA%3D',
    alt: '寵物展示 1',
    services: ['代遛服務', '寵物保母', '毛孩認養'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1518288774672-b94e808873ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHBldHN8ZW58MHx8MHx8fDA%3D',
    alt: '寵物展示 2',
    services: ['代遛服務', '寵物保母', '毛孩認養'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1512723185835-0700e5069a9a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fHBldHN8ZW58MHx8MHx8fDA%3D',
    alt: '寵物展示 3',
    services: ['代遛服務', '寵物保母', '毛孩認養'],
  },
  {
    image:
      'https://images.unsplash.com/photo-1582725461742-8ecd962c260d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxwZXRzfGVufDB8fDB8fHww',
    alt: '寵物展示 4',
  },
]

const scrollY = ref(0)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 900)

const logoScale = computed(() => 1 + (2 * scrollY.value) / 500)
const isLogoVisible = computed(() => scrollY.value <= windowHeight.value * 1)
const isShowcaseVisible = computed(() => scrollY.value > windowHeight.value * 0.9)
const isMarqueeVisible = computed(() => scrollY.value > windowHeight.value * 2)
const isEnterBtnVisible = computed(() => scrollY.value > windowHeight.value * 6)

const enterBtnScale = computed(() => {
  const threshold = windowHeight.value * 6
  if (scrollY.value <= threshold) return 0.9
  const progress = Math.min((scrollY.value - threshold) / (windowHeight.value * 2), 1)
  return 1 + progress * 0.35
})

const logoStyle = computed(() => ({
  transform: `scale(${logoScale.value})`,
  opacity: isLogoVisible.value ? 1 : 0,
}))

const enterBtnStyle = computed(() => ({
  transform: `scale(${enterBtnScale.value})`,
}))

function handleScroll() {
  scrollY.value = window.scrollY
}

function handleResize() {
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  handleResize()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="relative h-[1000vh] overflow-x-clip bg-brand-cream">
    <!-- 略過動畫直接進入首頁 -->
    <RouterLink
      class="fixed top-4 right-4 z-50 rounded-full border-2 border-neutral-800 bg-white/90 px-4 py-1.5 text-sm font-bold text-neutral-900 backdrop-blur-xs transition hover:border-brand-coral hover:bg-brand-coral hover:text-white sm:top-6 sm:right-7 sm:px-5 sm:py-2 sm:text-base"
      :to="{ name: 'home' }"
    >
      略過動畫 →
    </RouterLink>

    <!-- 滾動提示 -->
    <div
      v-show="isLogoVisible"
      class="scroll-hint pointer-events-none fixed bottom-8 left-1/2 z-40 flex flex-col items-center gap-1 text-sm font-bold text-brand-coral sm:bottom-10 sm:text-base"
    >
      <span>向下滾動探索</span>
      <ChevronsDown class="h-5 w-5" />
    </div>

    <!-- Logo 滾動放大與淡出 -->
    <div class="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <img
        class="w-48 max-w-[65vw] transition-opacity duration-300 ease-out sm:w-64 md:w-72"
        :src="svgAsset('logoGroup.svg')"
        alt="PetLove Logo"
        :style="logoStyle"
      />
    </div>

    <!-- 跑馬字串 -->
    <div
      class="pointer-events-none fixed top-1/2 left-0 z-20 w-full -translate-y-1/2 overflow-hidden transition-opacity duration-700 ease-in-out"
      :class="isMarqueeVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="w-full overflow-hidden whitespace-nowrap">
        <p
          class="loading-marquee inline-block text-4xl font-black text-brand-coral/90 drop-shadow-[0_2px_12px_rgba(255,255,255,0.75)] sm:text-6xl lg:text-8xl"
        >
          {{ marqueeText }}
        </p>
      </div>
    </div>

    <!-- 進入首頁按鈕 -->
    <div class="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4">
      <RouterLink
        id="myButton"
        class="inline-flex items-center justify-center rounded-full border-[3px] border-neutral-800 bg-brand-yellow px-7 py-3.5 text-lg font-black text-neutral-900 shadow-xl transition-all duration-300 hover:bg-brand-coral hover:text-white sm:px-11 sm:py-4 sm:text-2xl"
        :class="
          isEnterBtnVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        "
        :style="enterBtnStyle"
        :to="{ name: 'home' }"
      >
        點擊進入首頁
      </RouterLink>
    </div>

    <!-- 圖片與服務介紹區 -->
    <div
      class="relative z-15 mx-auto max-w-2xl px-4 pt-[110vh] pb-[140vh] transition-opacity duration-300 ease-in-out sm:px-6"
      :class="isShowcaseVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div v-for="item in showcaseItems" :key="item.image" class="mb-20 sm:mb-32">
        <img class="w-full rounded-3xl object-cover shadow-lg" :src="item.image" :alt="item.alt" />
        <div v-if="item.services" class="my-6 space-y-2 text-center sm:my-8 sm:space-y-3">
          <h2
            v-for="service in item.services"
            :key="service"
            class="p-2 text-2xl font-black rounded-xl border- border-brand-coral text-brand-coral sm:text-4xl"
          >
            <span>{{ service }}</span>
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-hint {
  animation: float-down 1.8s ease-in-out infinite;
}

.loading-marquee {
  animation: marquee-left 45s linear infinite;
}
</style>
