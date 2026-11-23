<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface FooterLinkItem {
  label: string
  to: string
}

const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const serviceLinks: FooterLinkItem[] = [
  { label: '寵物代遛', to: '/walking' },
  { label: '寵物保母', to: '/nanny' },
  { label: '毛孩領養', to: '/adopt' },
]

const shopLinks: FooterLinkItem[] = [
  { label: '乾飼料', to: '/shop/category/乾飼料' },
  { label: '罐頭', to: '/shop/category/罐頭' },
  { label: '零食', to: '/shop/category/零食' },
  { label: '其他用品', to: '/shop/category/其他用品' },
]

const contactItems = ['04-2326-5860', '10:00 - 22:00', 'petlove@gmail.com']
</script>

<template>
  <footer
    class="mt-12 w-full rounded-t-[48px] bg-brand-yellow px-6 pt-10 pb-12 md:mt-16 md:rounded-t-[80px] md:pt-12 md:pb-14"
  >
    <div class="mx-auto max-w-5xl">
      <div class="mb-8 flex justify-center md:mb-10">
        <RouterLink :to="{ name: 'home' }" class="inline-flex justify-center">
          <img
            :src="asset('LOGO.png')"
            alt="PetLove Logo"
            class="w-44 transition hover:opacity-90 sm:w-56 md:w-64"
          />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-8">
        <div>
          <h2 class="mb-4 select-none text-xl font-black text-neutral-900">服務項目</h2>
          <ul class="space-y-3">
            <li v-for="item in serviceLinks" :key="item.to">
              <RouterLink
                :to="item.to"
                class="text-base font-medium text-neutral-900 transition hover:text-brand-coral"
              >
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 select-none text-xl font-black text-neutral-900">商品一覽</h2>
          <ul class="space-y-3">
            <li v-for="item in shopLinks" :key="item.label">
              <RouterLink
                :to="item.to"
                class="text-base font-medium text-neutral-900 transition hover:text-brand-coral"
              >
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="select-none">
          <h2 class="mb-4 text-xl font-black text-neutral-900">聯絡我們</h2>
          <ul class="space-y-3">
            <li v-for="text in contactItems" :key="text" class="text-base font-medium text-neutral-900">
              {{ text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
