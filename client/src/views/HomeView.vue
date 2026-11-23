<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

interface ServiceItem {
  title: string
  image: string
}

interface StepItem {
  step: number
  iconClass: string
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

const marquee1Text = 'We love your pets!! '.repeat(35)
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
    iconClass: 'bi bi-1-circle-fill',
    title: '搜尋合適保姆',
    description: '尋找適合保母或遛狗者',
    image:
      'https://media.istockphoto.com/id/1388719795/photo/asian-women-viewing-real-estate-websites-on-a-computer.webp?a=1&b=1&s=612x612&w=0&k=20&c=8VaDYrMJL6LCjSEgZEU6LwkTrY0Wq8RJ76phq68l9zc=',
  },
  {
    step: 2,
    iconClass: 'bi bi-2-circle-fill',
    title: '發出請求',
    description: '向合適保姆或遛狗者發出請求及聯繫',
    image:
      'https://images.unsplash.com/photo-1504595403659-9088ce801e29?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    step: 3,
    iconClass: 'bi bi-3-circle-fill',
    title: '付款及會面',
    description: '線上付款後，即可安排會面',
    image:
      'https://media.istockphoto.com/id/459429875/photo/business-colleagues-discussing.jpg?s=612x612&w=0&k=20&c=jtHwLuYYzdg9TtMOyRbDGjJy6qCuZJUdXrRde5Zfr8M=',
  },
  {
    step: 4,
    iconClass: 'bi bi-4-circle-fill',
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

// Template Refs（取代 document.querySelector）
const section1Ref = ref<HTMLElement | null>(null)
const section2Ref = ref<HTMLElement | null>(null)

const followIconStyle = computed(() => ({
  transform: `translate(${cursorPos.value.x}px, ${cursorPos.value.y}px)`,
}))

const logoStyle = computed(() => ({
  transform: `scale(${logoScale.value})`,
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
  <main>
    <AppHeader />

    <!-- 鼠標跟隨 -->
    <div id="follow-icon" :style="followIconStyle">
      <img class="ld ld-jump" :src="asset('鼠標1.svg', 'svg')" alt="Follow Icon" />
    </div>

    <!-- GoTop -->
    <div class="d-flex justify-content-center">
      <a
        v-show="showScrollExtras"
        class="goTop text-center ld ld-breath"
        href="#"
        @click.prevent="scrollToTop"
      >
        GO TOP<br />
        <img class="text-center" :src="asset('goTop.svg', 'svg')" alt="回到頂部" />
      </a>
    </div>

    <!-- 輪播圖 -->
    <div class="d-flex justify-content-center align-items-top">
      <div class="carousel-container" id="carousel">
        <div id="store-carousel" class="carousel slide">
          <div class="carousel-indicators">
            <button
              v-for="(slide, index) in carouselSlides"
              :key="slide.src"
              type="button"
              :class="{ active: activeSlide === index }"
              :aria-label="`切換至第 ${index + 1} 張`"
              @click="goToSlide(index)"
            ></button>
          </div>

          <div class="carousel-inner d-flex">
            <div
              v-for="(slide, index) in carouselSlides"
              :key="slide.src"
              class="carousel-item store-item w-auto text-center"
              :class="{ active: activeSlide === index }"
            >
              <img :src="slide.src" :alt="slide.alt" class="d-block store-img" />
            </div>
          </div>

          <button class="carousel-control-prev" type="button" @click="prevSlide">
            <span class="carousel-control-prev-icon"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" @click="nextSlide">
            <span class="carousel-control-next-icon"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>

    <!-- LOGO 滾動放大區 -->
    <div class="logoBox text-center d-flex justify-content-center">
      <img
        class="myLogo"
        :src="asset('logoGroup.svg', 'svg')"
        alt="PetLove Group Logo"
        :style="logoStyle"
      />
    </div>

    <!-- 跑馬字串 0（底部固定） -->
    <div v-show="showScrollExtras" class="marquee0-container fixed-bottom">
      <div class="marquee0">
        <p>{{ marquee0Text }}</p>
      </div>
    </div>

    <!-- 插圖動畫 -->
    <div class="cutePic">
      <div class="cutePic1 x2 ld ld-wander-v sticky-top">
        <img :src="asset('看書.svg', 'svg')" alt="看書插圖" />
      </div>
      <div class="cutePic2 ld ld-rubber-h">
        <img :src="asset('快樂插圖.svg', 'svg')" alt="快樂插圖" />
      </div>
    </div>

    <!-- 跑馬字串 1 -->
    <div class="marquee1-container my-5">
      <div class="marquee1">
        <p>{{ marquee1Text }}</p>
      </div>
    </div>

    <!-- 服務項目 -->
    <section
      ref="section1Ref"
      class="section showSection1"
      :class="{ 'is-visible': isSection1Visible }"
    >
      <div class="d-flex justify-content-center">
        <p class="title ld ld-jump">服務項目</p>
      </div>

      <div class="d-flex flex-wrap justify-content-center">
        <div
          v-for="service in serviceItems"
          :key="service.title"
          class="mx-3 serveBox d-flex flex-wrap justify-content-center align-items-center"
        >
          <img :src="service.image" :alt="service.title" />
          <p class="fs-4 fw-bold">{{ service.title }}</p>
        </div>
      </div>
    </section>

    <!-- 跑馬字串 2 -->
    <div class="marquee2-container">
      <div class="marquee2">
        <p>{{ marquee2Text }}</p>
      </div>
    </div>

    <!-- 下半部區塊 -->
    <div class="DownAll">
      <!-- 流程說明 -->
      <section
        ref="section2Ref"
        class="section showSection2"
        :class="{ 'is-visible': isSection2Visible }"
      >
        <div class="d-flex justify-content-center" id="step">
          <p class="title ld ld-jump">流程說明</p>
        </div>

        <div class="d-flex flex-wrap justify-content-center">
          <div
            v-for="item in stepItems"
            :key="item.step"
            class="mx-3 stepBox d-flex flex-wrap justify-content-center align-items-center"
          >
            <img :src="item.image" :alt="item.title" />
            <div class="d-flex m-1">
              <i class="mt-1" :class="item.iconClass"></i>
              <p class="mt-3 fs-4">{{ item.title }}</p>
            </div>
            <div class="m-1">
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 加入我們 -->
      <section class="section joinUs d-flex justify-content-center align-items-center">
        <div>
          <img
            class="leftPic"
            src="https://plus.unsplash.com/premium_photo-1661896746165-b95b72a6e9e2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="加入我們"
          />
        </div>

        <div class="joinContext">
          <div class="d-flex flex-nowrap align-items-center">
            <p class="title ld ld-jump">開放加入</p>
            <img class="ld ld-bounce" :src="asset('join.svg', 'svg')" alt="開放加入插圖" />
          </div>
          <h6>歡迎有興趣的夥伴加入，成為寵物保母或代遛幫手</h6>
          <button type="button" class="me-5">成為寵物保母</button>
          <button type="button" class="me-5">成為代遛幫手</button>
        </div>
      </section>

      <!-- 關於我們（圖片跑馬） -->
      <section class="section w-100">
        <div class="marquee3-container w-auto">
          <div class="marquee3 d-flex justify-content-center w-100">
            <p>
              <img
                v-for="(imgSrc, index) in galleryImages"
                :key="imgSrc"
                :src="imgSrc"
                :alt="`毛孩照片 ${index + 1}`"
              />
            </p>
          </div>
        </div>
      </section>
    </div>

    <AppFooter />
  </main>
</template>

<style lang="scss" scoped>
@keyframes marquee1 {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes marquee2 {
  0% {
    transform: translateX(-90%);
  }
  100% {
    transform: translateX(0%);
  }
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #ffcb48;
  opacity: 1;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}

.carousel-container .carousel-inner {
  height: 100vh;
}

/* followIcon */
#follow-icon {
  position: fixed;
  top: 10px;
  left: -80px;
  pointer-events: none;
  transition: transform 0.3s ease-out;
}

#follow-icon > img {
  width: 50px;
  height: 50px;
}

.goTop {
  text-decoration: none;
  flex-direction: column;
  color: #ff6144;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 700;
  animation-duration: 4s;
  position: fixed;
  right: 20px;
  bottom: 40px;
  z-index: 500;
}

.goTop img {
  width: 100px;
}

.cutePic .cutePic1 {
  width: 150px;
  position: absolute;
  left: 100px;
  top: 2800px;
  z-index: 100;
}

.cutePic .cutePic2 {
  width: 150px;
  position: absolute;
  right: 50px;
  top: 3550px;
  z-index: 100;
}

.logoBox {
  width: 100vw;
  height: 100vh;
  background-color: rgb(255, 255, 255);
  z-index: -10;
  img {
    scale: 0.4;
    transition: transform 0s;
  }
}

/* 跑馬字串 0 */
.marquee0-container {
  width: 100%;
  overflow: hidden;
}

.marquee0-container .marquee0 {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 0;
  box-sizing: border-box;
}

.marquee0-container .marquee0 p {
  display: inline-block;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: #ff6144;
  padding-top: 4px;
  animation: marquee1 100s linear infinite;
}

/* 跑馬字串 1 */
.marquee1-container {
  margin: 50px 0;
  width: 100%;
  overflow: hidden;
  display: flex;
}

.marquee1-container .marquee1 {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 0;
  box-sizing: border-box;
}

.marquee1-container .marquee1 p {
  display: inline-block;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 800;
  font-size: 120px;
  color: #ff6144;
  padding-top: 12px;
  animation: marquee1 400s linear infinite;
}

/* 跑馬字串 2 */
.marquee2-container {
  margin: 200px 0;
  width: 100%;
  overflow: hidden;
  display: flex;
}

.marquee2-container .marquee2 {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 0;
  box-sizing: border-box;
}

.marquee2-container .marquee2 p {
  display: inline-block;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 800;
  font-size: 120px;
  color: #ff6144;
  padding-top: 12px;
  border: 5px dashed #ff6144;
  animation: marquee2 400s linear infinite;
}

hr {
  margin: 200px 0;
  height: 5px;
  color: #ff6144;
  background-color: #ff6144;
  opacity: 1;
}

.showSection1 {
  transform: translateX(-100%);
  transition: transform 0.5s ease-in-out;
}

.showSection2 {
  transform: translateX(100%);
  transition: transform 0.5s ease-in-out;
}

.showSection1.is-visible,
.showSection2.is-visible {
  transform: translateX(0);
}

.section {
  margin: 300px 0;
  height: 400px;
}

.section .title {
  font-size: 35px;
  font-weight: 900;
}

.section .stepBox,
.section .serveBox {
  width: 250px;
  height: 300px;
  border: 1.5px solid #ff6144;
  border-radius: 20px;
  margin: 15px;
  padding: 0 15px;
}

.section .stepBox img,
.section .serveBox img {
  margin: 10px 0;
  width: 100%;
  height: 40%;
  object-fit: cover;
}

.section .stepBox:hover,
.section .serveBox:hover {
  height: 330px;
  background-color: #ffcb48;
  border: white;
  scale: 1.1;
}

.joinUs {
  margin-top: 100px;
  background-color: rgb(250, 245, 237);
  padding: 30px;
}

.joinUs .leftPic {
  width: 300px;
  height: 350px;
  object-fit: cover;
  margin-right: 100px;
}

.joinUs .joinContext img {
  margin-left: 30px;
  height: 80px;
}

.joinUs .joinContext h6 {
  margin: 30px 0;
}

.joinUs .joinContext button {
  color: white;
  width: 200px;
  height: 80px;
  background-color: #ffcb48;
  border-radius: 50px;
  border: 2px solid rgb(0, 0, 0);
}

.joinUs .joinContext button:hover {
  background-color: #ff6144;
}

/* 跑馬圖 */
.marquee3-container {
  width: 100vw;
  overflow: hidden;
  top: 500px;
  left: 0;
  z-index: -1;
}

.marquee3 {
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}

.marquee3 img {
  width: 20%;
  height: 100%;
  object-fit: cover;
}

.marquee3 p {
  display: inline-block;
  animation: marquee1 100s linear infinite;
}
</style>
