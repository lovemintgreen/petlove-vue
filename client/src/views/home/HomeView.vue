<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

interface ServiceItem {
  title: string
  image: string
}

interface StepItem {
  step: number
  title: string
  description: string
  image: string
}

const asset = (filename: string, type = 'img') => `${import.meta.env.BASE_URL}${type}/${filename}`

const carouselSlides = [
  { src: asset('輪播圖1.png'), alt: '寵樂輪播圖 1' },
  { src: asset('輪播圖2.png'), alt: '寵樂輪播圖 2' },
  { src: asset('輪播圖3.png'), alt: '寵樂輪播圖 3' },
]

const marquee0Text =
  '寵樂提供代遛服務、寵物保母、毛孩認養、以及販售寵物相關的商品。致力提供您與毛孩最優質的服務，讓毛孩爸媽能放心將毛孩交給我們！ '.repeat(
    5,
  )

const marquee1Text = 'We love your pets!! '.repeat(24)
const marquee2Text = 'We really really love your pets!!! '.repeat(12)

const serviceItems: ServiceItem[] = [
  {
    title: '代遛服務',
    image:
      'https://media.istockphoto.com/id/1717007444/photo/beautiful-woman-dog-walker-with-three-dogs-in-the-public-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=u3eaKRyoF3BtwNkAmVubULNLkZKcUkRf4hEBj5q5XzY=',
  },
  {
    title: '毛孩保母',
    image:
      'https://media.istockphoto.com/id/1205255316/photo/pet-daycare.webp?a=1&b=1&s=612x612&w=0&k=20&c=dUOF8gReaGDjCvgxuyCACi2LU875QsggR640VMBo0dg=',
  },
  {
    title: '毛孩領養',
    image:
      'https://media.istockphoto.com/id/1307238003/photo/life-is-good-with-a-faithful-friend-by-your-side.webp?a=1&b=1&s=612x612&w=0&k=20&c=nUAq6NQlu16-xaBJxua1JhjxtpmxBk2EUUSVAXakgQU=',
  },
  {
    title: '添購商品',
    image:
      'https://images.unsplash.com/photo-1695169954725-fa757fd7315c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
]

const stepItems: StepItem[] = [
  {
    step: 1,
    title: '搜尋合適保姆',
    description: '尋找適合保母或遛狗者',
    image:
      'https://media.istockphoto.com/id/1388719795/photo/asian-women-viewing-real-estate-websites-on-a-computer.webp?a=1&b=1&s=612x612&w=0&k=20&c=8VaDYrMJL6LCjSEgZEU6LwkTrY0Wq8RJ76phq68l9zc=',
  },
  {
    step: 2,
    title: '發出請求',
    description: '向合適保姆或遛狗者發出請求及聯繫',
    image:
      'https://images.unsplash.com/photo-1504595403659-9088ce801e29?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    step: 3,
    title: '付款及會面',
    description: '線上付款後，即可安排會面',
    image:
      'https://media.istockphoto.com/id/459429875/photo/business-colleagues-discussing.jpg?s=612x612&w=0&k=20&c=jtHwLuYYzdg9TtMOyRbDGjJy6qCuZJUdXrRde5Zfr8M=',
  },
  {
    step: 4,
    title: '確認合適度',
    description: '在開始服務後，若發現保母不合適，可進行更換',
    image:
      'https://media.istockphoto.com/id/2149058679/photo/woman-dog-and-paw-high-five-in-home-or-learning-trick-on-sofa-for-animal-behaviour-obedience.jpg?s=2048x2048&w=is&k=20&c=f9DkjyUOQcP3Igw72E_g9qOatCZiplPrjy7N6GiCoXg=',
  },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhdHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBldHN8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1482434368596-fbd06cae4f89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhdHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1519612535780-b5d7d96c36f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBldHN8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhdHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1509205477838-a534e43a849f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxkb2d8ZW58MHx8MHx8fDA%3D',
]

// 互動狀態
const cursorPos = ref({ x: 0, y: 0 })
const showScrollExtras = ref(false)
const logoScale = ref(1)
const isSection1Visible = ref(false)
const isSection2Visible = ref(false)
const activeSlide = ref(0)

// Template Refs
const section1Ref = ref<HTMLElement | null>(null)
const section2Ref = ref<HTMLElement | null>(null)

const followIconStyle = computed(() => ({
  transform: `translate(${cursorPos.value.x}px, ${cursorPos.value.y}px)`,
}))

const logoStyle = computed(() => ({
  transform: `scale(${Math.min(logoScale.value, 1.8)})`,
}))

function handleMouseMove(event: MouseEvent) {
  cursorPos.value = { x: event.clientX, y: event.clientY }
}

function handleScroll() {
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  showScrollExtras.value = scrollPosition > documentHeight * 0.2
  logoScale.value = 1 + scrollPosition / 1000

  const triggerLine = windowHeight * 0.9

  if (section1Ref.value) {
    isSection1Visible.value = triggerLine > section1Ref.value.getBoundingClientRect().top
  }

  if (section2Ref.value) {
    isSection2Visible.value = triggerLine > section2Ref.value.getBoundingClientRect().top
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + carouselSlides.length) % carouselSlides.length
}

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % carouselSlides.length
}

function goToSlide(index: number) {
  activeSlide.value = index
}

let carouselTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  carouselTimer = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('scroll', handleScroll)
  if (carouselTimer) {
    clearInterval(carouselTimer)
  }
})
</script>

<template>
  <main class="relative overflow-x-clip pt-20">
    <AppHeader />

    <!-- 鼠標跟隨（僅桌機顯示） -->
    <div
      id="follow-icon"
      class="pointer-events-none fixed top-2.5 -left-20 z-40 hidden transition-transform duration-300 ease-out lg:block"
      :style="followIconStyle"
    >
      <img class="ld ld-jump h-12 w-12" :src="asset('鼠標1.svg', 'svg')" alt="Follow Icon" />
    </div>

    <!-- GoTop -->
    <button
      v-show="showScrollExtras"
      type="button"
      class="ld ld-breath fixed right-4 bottom-12 z-40 flex cursor-pointer flex-col items-center text-xs font-bold text-brand-coral sm:right-6 sm:bottom-14 sm:text-sm"
      style="animation-duration: 4s"
      @click="scrollToTop"
    >
      <span>GO TOP</span>
      <img class="w-16 sm:w-24" :src="asset('goTop.svg', 'svg')" alt="回到頂部" />
    </button>

    <!-- 輪播圖 -->
    <section class="relative w-full overflow-hidden bg-brand-cream" aria-label="精選輪播圖">
      <div class="relative h-[42vh] w-full sm:h-[58vh] lg:h-[82vh]">
        <div
          v-for="(slide, index) in carouselSlides"
          :key="slide.src"
          class="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          :class="activeSlide === index ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'"
        >
          <img :src="slide.src" :alt="slide.alt" class="h-full w-full object-cover" />
        </div>

        <!-- 前後切換鈕 -->
        <button
          type="button"
          class="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-brand-yellow text-neutral-900 shadow-md transition hover:bg-brand-coral hover:text-white sm:left-6 sm:h-14 sm:w-14 lg:h-20 lg:w-20"
          aria-label="上一張"
          @click="prevSlide"
        >
          <ChevronLeft class="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
        </button>

        <button
          type="button"
          class="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-brand-yellow text-neutral-900 shadow-md transition hover:bg-brand-coral hover:text-white sm:right-6 sm:h-14 sm:w-14 lg:h-20 lg:w-20"
          aria-label="下一張"
          @click="nextSlide"
        >
          <ChevronRight class="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
        </button>

        <!-- 指示點 -->
        <div class="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2.5">
          <button
            v-for="(slide, index) in carouselSlides"
            :key="slide.src"
            type="button"
            class="h-2.5 cursor-pointer rounded-full transition-all sm:h-3"
            :class="
              activeSlide === index
                ? 'w-8 bg-brand-coral'
                : 'w-2.5 bg-white/80 hover:bg-brand-yellow sm:w-3'
            "
            :aria-label="`切換至第 ${index + 1} 張`"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </section>

    <!-- LOGO 滾動放大區 -->
    <section
      class="flex min-h-[55vh] w-full items-center justify-center overflow-hidden bg-white px-4 sm:min-h-[75vh] lg:min-h-screen"
    >
      <img
        class="w-44 max-w-[60vw] sm:w-64 lg:w-80"
        :src="asset('logoGroup.svg', 'svg')"
        alt="PetLove Group Logo"
        :style="logoStyle"
      />
    </section>

    <!-- 跑馬字串 0（底部固定） -->
    <div
      v-show="showScrollExtras"
      class="fixed inset-x-0 bottom-0 z-30 w-full overflow-hidden bg-brand-cream/95 py-1.5 backdrop-blur-xs"
    >
      <div class="w-full overflow-hidden whitespace-nowrap">
        <p
          class="marquee-left-slow inline-block text-sm font-extrabold text-brand-coral sm:text-lg"
        >
          {{ marquee0Text }}
        </p>
      </div>
    </div>

    <!-- 插圖動畫（寬螢幕裝飾） -->
    <div class="pointer-events-none hidden xl:block">
      <div class="ld ld-wander-v x2 absolute top-[2100px] left-12 z-20 w-36">
        <img :src="asset('看書.svg', 'svg')" alt="看書插圖" />
      </div>
      <div class="ld ld-rubber-h absolute top-[2850px] right-10 z-20 w-36">
        <img :src="asset('快樂插圖.svg', 'svg')" alt="快樂插圖" />
      </div>
    </div>

    <!-- 跑馬字串 1 -->
    <div class="my-10 w-full overflow-hidden sm:my-16">
      <div class="w-full overflow-hidden whitespace-nowrap">
        <p
          class="marquee-left-banner inline-block text-4xl font-extrabold text-brand-coral sm:text-6xl lg:text-8xl"
        >
          {{ marquee1Text }}
        </p>
      </div>
    </div>

    <!-- 服務項目 -->
    <section
      ref="section1Ref"
      class="mx-auto my-20 max-w-6xl px-4 transition-transform duration-500 ease-in-out sm:my-28 sm:px-6 lg:my-36"
      :class="isSection1Visible ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="mb-10 flex justify-center">
        <h2 class="ld ld-jump text-3xl font-black text-neutral-900 sm:text-4xl">服務項目</h2>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="service in serviceItems"
          :key="service.title"
          class="flex flex-col items-center rounded-[20px] border-[1.5px] border-brand-coral bg-white p-4 text-center transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-brand-yellow hover:shadow-lg"
        >
          <img
            :src="service.image"
            :alt="service.title"
            class="mb-4 h-44 w-full rounded-xl object-cover"
          />
          <p class="mt-auto py-2 text-xl font-bold text-neutral-900">{{ service.title }}</p>
        </article>
      </div>
    </section>

    <!-- 跑馬字串 2 -->
    <div class="my-16 w-full overflow-hidden sm:my-28">
      <div class="w-full overflow-hidden whitespace-nowrap">
        <p
          class="marquee-right-banner inline-block border-y-4 border-dashed border-brand-coral py-3 text-4xl font-extrabold text-brand-coral sm:text-6xl lg:text-8xl"
        >
          {{ marquee2Text }}
        </p>
      </div>
    </div>

    <!-- 流程說明 -->
    <section
      ref="section2Ref"
      id="step"
      class="mx-auto my-20 max-w-6xl px-4 transition-transform duration-500 ease-in-out sm:my-28 sm:px-6 lg:my-36"
      :class="isSection2Visible ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="mb-10 flex justify-center">
        <h2 class="ld ld-jump text-3xl font-black text-neutral-900 sm:text-4xl">流程說明</h2>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in stepItems"
          :key="item.step"
          class="flex flex-col items-center rounded-[20px] border-[1.5px] border-brand-coral bg-white p-4 text-center transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-brand-yellow hover:shadow-lg"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="mb-4 h-40 w-full rounded-xl object-cover"
          />
          <div class="mb-2 flex items-center justify-center gap-2">
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-coral text-sm font-black text-white"
            >
              {{ item.step }}
            </span>
            <h3 class="text-xl font-bold text-neutral-900">{{ item.title }}</h3>
          </div>
          <p class="text-sm leading-relaxed text-neutral-700">{{ item.description }}</p>
        </article>
      </div>
    </section>

    <!-- 加入我們 -->
    <section class="my-20 bg-brand-warm px-4 py-12 sm:px-8 sm:py-16 lg:my-28">
      <div
        class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16"
      >
        <img
          class="h-72 w-full max-w-xs rounded-2xl object-cover shadow-md sm:h-88 sm:w-76 shrink-0"
          src="https://plus.unsplash.com/premium_photo-1661896746165-b95b72a6e9e2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="加入我們"
        />

        <div class="text-center lg:text-left">
          <div class="flex items-center justify-center gap-4 lg:justify-start">
            <h2 class="ld ld-jump text-3xl font-black text-neutral-900 sm:text-4xl">開放加入</h2>
            <img
              class="ld ld-bounce h-14 w-auto sm:h-20"
              :src="asset('join.svg', 'svg')"
              alt="開放加入插圖"
            />
          </div>

          <p class="my-6 text-base font-medium text-neutral-700 sm:text-lg">
            歡迎有興趣的夥伴加入，成為寵物保母或代遛幫手
          </p>

          <div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <button
              type="button"
              class="h-16 w-full cursor-pointer rounded-full border-2 border-black bg-brand-yellow px-8 text-lg font-bold text-white transition hover:bg-brand-coral sm:h-20 sm:w-52"
            >
              成為寵物保母
            </button>
            <button
              type="button"
              class="h-16 w-full cursor-pointer rounded-full border-2 border-black bg-brand-yellow px-8 text-lg font-bold text-white transition hover:bg-brand-coral sm:h-20 sm:w-52"
            >
              成為代遛幫手
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 關於我們（圖片跑馬） -->
    <section class="my-16 w-full overflow-hidden py-4 sm:my-24">
      <div class="marquee-gallery flex w-max gap-4 px-4">
        <img
          v-for="(imgSrc, index) in [...galleryImages, ...galleryImages]"
          :key="`${imgSrc}-${index}`"
          :src="imgSrc"
          :alt="`毛孩照片 ${(index % galleryImages.length) + 1}`"
          class="h-44 w-44 shrink-0 rounded-2xl object-cover shadow-sm sm:h-56 sm:w-56 md:h-64 md:w-64"
        />
      </div>
    </section>

    <AppFooter />
  </main>
</template>

<style scoped>
.marquee-left-slow {
  animation: marquee-left 60s linear infinite;
}

.marquee-left-banner {
  animation: marquee-left 90s linear infinite;
}

.marquee-right-banner {
  animation: marquee-right 90s linear infinite;
}

.marquee-gallery {
  animation: marquee-left 45s linear infinite;
}
</style>
