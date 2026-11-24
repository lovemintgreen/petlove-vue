<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Menu, X } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'

interface NavLinkItem {
  label: string
  to: string
}

const cartStore = useCartStore()
const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const serviceLinks: NavLinkItem[] = [
  { label: '代遛服務', to: '/walking' },
  { label: '寵物保母', to: '/nanny' },
  { label: '毛孩領養', to: '/adopt' },
]

const isServiceMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const isMobileServiceOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleServiceMenu() {
  isServiceMenuOpen.value = !isServiceMenuOpen.value
}

function closeAllMenus() {
  isServiceMenuOpen.value = false
  isMobileMenuOpen.value = false
  isMobileServiceOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isServiceMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-brand-coral shadow-sm">
    <nav
      class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      aria-label="主導覽列"
    >
      <!-- Logo -->
      <RouterLink :to="{ name: 'home' }" class="shrink-0" @click="closeAllMenus">
        <img :src="asset('logo白.png')" alt="PetLove Logo" class="h-20 w-37.5 sm:h-25" />
      </RouterLink>

      <!-- 桌機導覽選單 -->
      <ul class="hidden items-center gap-5 lg:flex">
        <!-- <li ref="dropdownRef" class="relative">
          <button
            type="button"
            class="inline-flex h-13 w-32 cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-black bg-white text-base font-bold text-neutral-900 transition hover:border-white hover:bg-brand-yellow hover:text-white active:text-[#ff4f30]"
            :aria-expanded="isServiceMenuOpen"
            @click.stop="toggleServiceMenu"
          >
            <span>服務項目</span>
            <ChevronDown
              class="h-4 w-4 transition-transform duration-200"
              :class="{ 'rotate-180': isServiceMenuOpen }"
            />
          </button>

          <ul
            v-show="isServiceMenuOpen"
            class="absolute left-0 mt-2 w-40 overflow-hidden rounded-2xl border-[3px] border-black bg-white py-1.5 shadow-lg"
          >
            <li v-for="item in serviceLinks" :key="item.to">
              <RouterLink
                :to="item.to"
                class="block px-4 py-2.5 text-lg font-medium text-neutral-900 transition hover:bg-brand-yellow"
                @click="closeAllMenus"
              >
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </li> -->

        <li>
          <RouterLink
            to="/shop"
            class="inline-flex h-13 w-32 items-center justify-center rounded-full border-2 border-black bg-white text-base font-bold text-neutral-900 transition hover:border-white hover:bg-brand-yellow hover:text-white active:text-[#ff4f30]"
          >
            商品一覽
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/faq"
            class="inline-flex h-13 w-32 items-center justify-center rounded-full border-2 border-black bg-white text-base font-bold text-neutral-900 transition hover:border-white hover:bg-brand-yellow hover:text-white active:text-[#ff4f30]"
          >
            FAQ
          </RouterLink>
        </li>
      </ul>

      <!-- 右側圖示 + 行動版漢堡鈕 -->
      <div class="flex items-center gap-3 sm:gap-5">
        <RouterLink
          to="/member"
          class="inline-flex items-center transition hover:scale-105"
          aria-label="會員中心"
          @click="closeAllMenus"
        >
          <img :src="asset('membercat.png')" alt="會員中心" class="h-10 w-auto sm:h-13" />
        </RouterLink>

        <RouterLink
          to="/shop/cart"
          class="relative inline-flex items-center transition hover:scale-105"
          aria-label="購物車"
          @click="closeAllMenus"
        >
          <img :src="asset('cart.png')" alt="購物車" class="h-9 w-auto sm:h-12" />
          <span
            v-if="cartStore.totalCount > 0"
            class="absolute -top-1 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-neutral-900 bg-brand-yellow px-1 text-xs font-black text-neutral-900"
          >
            {{ cartStore.totalCount > 99 ? '99+' : cartStore.totalCount }}
          </span>
        </RouterLink>

        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 border-black bg-white text-neutral-900 transition hover:bg-brand-yellow lg:hidden"
          :aria-expanded="isMobileMenuOpen"
          aria-label="切換導覽選單"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" class="h-6 w-6" />
          <Menu v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <!-- 行動版抽屜選單 -->
    <div
      v-show="isMobileMenuOpen"
      class="border-t-2 border-black/15 bg-brand-coral px-4 pt-3 pb-5 shadow-md lg:hidden"
    >
      <ul class="mx-auto flex max-w-md flex-col gap-2.5">
        <li>
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 border-black bg-white px-4 py-3 text-base font-bold text-neutral-900 transition hover:bg-brand-yellow"
            :aria-expanded="isMobileServiceOpen"
            @click="isMobileServiceOpen = !isMobileServiceOpen"
          >
            <span>服務項目</span>
            <ChevronDown
              class="h-5 w-5 transition-transform duration-200"
              :class="{ 'rotate-180': isMobileServiceOpen }"
            />
          </button>

          <ul
            v-show="isMobileServiceOpen"
            class="mt-2 flex flex-col gap-1.5 rounded-2xl border-2 border-black bg-white/95 p-2"
          >
            <li v-for="item in serviceLinks" :key="item.to">
              <RouterLink
                :to="item.to"
                class="block rounded-xl px-4 py-2 text-base font-semibold text-neutral-800 transition hover:bg-brand-yellow"
                @click="closeAllMenus"
              >
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </li>

        <li>
          <RouterLink
            to="/shop"
            class="block rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-base font-bold text-neutral-900 transition hover:bg-brand-yellow"
            @click="closeAllMenus"
          >
            商品一覽
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/faq"
            class="block rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-base font-bold text-neutral-900 transition hover:bg-brand-yellow"
            @click="closeAllMenus"
          >
            FAQ
          </RouterLink>
        </li>
      </ul>
    </div>
  </header>
</template>
