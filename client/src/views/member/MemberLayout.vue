<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import MemberSidebar from './MemberSidebar.vue'

const svgAsset = (filename: string) => `${import.meta.env.BASE_URL}svg/${filename}`

// 依滑鼠懸停狀態切換右下角吉祥物圖片
const isMascotHovered = ref(false)
const mascotSrc = computed(() =>
  isMascotHovered.value ? svgAsset('sway.svg') : svgAsset('wait.svg'),
)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <div class="flex flex-1 flex-col md:flex-row">
      <MemberSidebar />

      <main class="relative flex-1 px-4 py-6 sm:px-6 md:px-9 md:py-8">
        <RouterView />

        <!-- 右下角回頂端插圖 -->
        <button
          type="button"
          class="fixed right-4 bottom-4 z-30 cursor-pointer bg-transparent p-0 sm:right-6 sm:bottom-6"
          aria-label="回到頂部"
          @mouseenter="isMascotHovered = true"
          @mouseleave="isMascotHovered = false"
          @click="scrollToTop"
        >
          <img :src="mascotSrc" alt="回到頂部插圖" class="h-auto w-16 sm:w-24" />
        </button>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
