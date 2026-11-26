<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import {
  LogOut,
  Menu,
  Package,
  PlusCircle,
  ShieldCheck,
  Store,
  User,
  X,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 行動版側邊抽屜選單開關
const isMobileMenuOpen = ref(false)

function closeMenu() {
  isMobileMenuOpen.value = false
}

// 清除登入權杖與使用者狀態後導回登入頁
async function handleLogout() {
  authStore.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream">
    <!-- 後台頂部列 -->
    <header class="sticky top-0 z-40 border-b-2 border-neutral-800 bg-neutral-900 text-white">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10 md:hidden"
            :aria-expanded="isMobileMenuOpen"
            aria-label="切換後台選單"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <X v-if="isMobileMenuOpen" class="h-5 w-5" />
            <Menu v-else class="h-5 w-5" />
          </button>

          <RouterLink
            :to="{ name: 'admin-products' }"
            class="flex items-center gap-2 text-lg font-black tracking-wide"
            @click="closeMenu"
          >
            <ShieldCheck class="h-6 w-6 text-brand-yellow" />
            <span>PetLove 管理後台</span>
          </RouterLink>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <span class="hidden text-sm font-semibold text-neutral-300 sm:inline">
            管理員：{{ authStore.user?.name }}
          </span>
          <RouterLink
            to="/shop"
            class="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-xs font-bold text-white transition hover:border-brand-yellow hover:bg-brand-yellow hover:text-neutral-900 sm:text-sm"
          >
            <Store class="h-4 w-4" />
            <span>前台商城</span>
          </RouterLink>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-coral px-3.5 py-1.5 text-xs font-bold text-white transition hover:opacity-90 sm:text-sm"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
            <span class="hidden sm:inline">登出</span>
          </button>
        </div>
      </div>

      <!-- 行動版展開選單 -->
      <nav
        v-show="isMobileMenuOpen"
        class="border-t border-white/10 bg-neutral-800 px-4 py-3 md:hidden"
        aria-label="行動版後台導覽"
      >
        <ul class="space-y-1.5">
          <li>
            <RouterLink
              :to="{ name: 'admin-products' }"
              active-class="bg-brand-yellow text-neutral-900"
              class="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white"
              @click="closeMenu"
            >
              <Package class="h-4 w-4" />
              <span>商品管理列表</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'admin-product-new' }"
              active-class="bg-brand-yellow text-neutral-900"
              class="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white"
              @click="closeMenu"
            >
              <PlusCircle class="h-4 w-4" />
              <span>上架新商品</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/member"
              class="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-neutral-300 hover:bg-white/10"
              @click="closeMenu"
            >
              <User class="h-4 w-4" />
              <span>返回會員中心</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- 主體區 -->
    <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
      <!-- 桌機側邊欄 -->
      <aside
        class="hidden w-60 shrink-0 border-r-2 border-[#f0dfc8] bg-brand-warm px-4 py-6 md:block"
        aria-label="後台導覽"
      >
        <nav class="space-y-2">
          <RouterLink
            :to="{ name: 'admin-products' }"
            exact-active-class="bg-brand-yellow font-black"
            class="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 transition hover:bg-brand-yellow/70"
          >
            <Package class="h-4 w-4" />
            <span>商品管理列表</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'admin-product-new' }"
            active-class="bg-brand-yellow font-black"
            class="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 transition hover:bg-brand-yellow/70"
          >
            <PlusCircle class="h-4 w-4" />
            <span>上架新商品</span>
          </RouterLink>

          <div class="my-4 border-t border-[#e9d7be]"></div>

          <RouterLink
            to="/member"
            class="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold text-neutral-600 transition hover:bg-white hover:text-neutral-900"
          >
            <User class="h-4 w-4" />
            <span>返回會員中心</span>
          </RouterLink>
        </nav>
      </aside>

      <!-- 內容區域 -->
      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
