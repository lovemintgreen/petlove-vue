<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ChevronDown, LogOut, Menu, ShieldCheck, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

interface SidebarLink {
  label: string
  to: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const mainLinks: SidebarLink[] = [
  { label: '商品訂單記錄', to: '/member/history' },
  { label: '我的請求', to: '/member/request' },
  { label: '工作清單', to: '/member/mission' },
  { label: '貓狗領養管理', to: '/member/adoption' },
]

const profileLinks: SidebarLink[] = [
  { label: '更改基本資料', to: '/member/userinfo' },
  { label: '更改工作設定', to: '/member/jobsetting' },
  { label: '密碼設定', to: '/member/password' },
  { label: '付款方式管理', to: '/member/payment' },
  { label: '常用收件地址', to: '/member/logistic' },
]

const isProfileRoute = (path: string) => profileLinks.some((item) => path.startsWith(item.to))

const isInfoMenuOpen = ref(isProfileRoute(route.path))
const isMobileNavOpen = ref(false)

watch(
  () => route.path,
  (newPath) => {
    if (isProfileRoute(newPath)) {
      isInfoMenuOpen.value = true
    }
  },
)

function toggleInfoMenu() {
  isInfoMenuOpen.value = !isInfoMenuOpen.value
}

function closeMobileNav() {
  isMobileNavOpen.value = false
}

async function handleLogout() {
  authStore.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <aside
    class="w-full shrink-0 border-b-2 border-[#f0dfc8] bg-brand-warm px-4 py-4 md:w-60 md:border-r-2 md:border-b-0 md:px-4 md:py-8 lg:w-64"
    aria-label="會員選單"
  >
    <!-- 行動版精簡標頭列 -->
    <div class="flex items-center justify-between md:hidden">
      <RouterLink to="/member/userpage" class="flex items-center gap-3" @click="closeMobileNav">
        <img
          :src="asset('大頭照.png')"
          alt="會員大頭照"
          class="h-12 w-12 rounded-full border-2 border-brand-yellow bg-white object-cover"
        />
        <span class="text-base font-extrabold text-neutral-900">
          {{ authStore.user?.name || '會員' }}
        </span>
      </RouterLink>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-bold text-neutral-800 transition hover:bg-brand-yellow"
        :aria-expanded="isMobileNavOpen"
        @click="isMobileNavOpen = !isMobileNavOpen"
      >
        <X v-if="isMobileNavOpen" class="h-4 w-4" />
        <Menu v-else class="h-4 w-4" />
        <span>{{ isMobileNavOpen ? '收合選單' : '會員選單' }}</span>
      </button>
    </div>

    <!-- 桌機／平板頭像區塊 -->
    <div class="mb-5 hidden border-b border-[#e9d7be] pb-6 text-center md:block">
      <RouterLink to="/member/userpage" class="inline-block">
        <img
          :src="asset('大頭照.png')"
          alt="會員大頭照"
          class="mx-auto h-24 w-24 rounded-full border-[3px] border-brand-yellow bg-white object-cover transition hover:scale-105"
        />
      </RouterLink>
      <RouterLink
        to="/member/userpage"
        class="mt-3 block text-lg font-extrabold text-neutral-900 transition hover:text-brand-coral"
      >
        {{ authStore.user?.name || '會員' }}
      </RouterLink>
      <RouterLink
        to="/member"
        class="mt-1 inline-block text-xs font-semibold text-neutral-500 hover:text-brand-coral"
      >
        會員控制台首頁
      </RouterLink>
    </div>

    <!-- 選單項目 -->
    <nav
      class="mt-4 flex-col gap-1.5 md:mt-0 md:flex"
      :class="isMobileNavOpen ? 'flex' : 'hidden'"
    >
      <RouterLink
        v-for="item in mainLinks"
        :key="item.to"
        :to="item.to"
        active-class="bg-brand-yellow font-bold"
        class="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-yellow sm:text-base"
        @click="closeMobileNav"
      >
        {{ item.label }}
      </RouterLink>

      <div>
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-yellow sm:text-base"
          :aria-expanded="isInfoMenuOpen"
          @click="toggleInfoMenu"
        >
          <span>會員資料</span>
          <ChevronDown
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': isInfoMenuOpen }"
          />
        </button>

        <ul v-show="isInfoMenuOpen" class="mt-1 space-y-1 pl-3">
          <li v-for="item in profileLinks" :key="item.to">
            <RouterLink
              :to="item.to"
              active-class="bg-[#ffe49c] font-bold text-neutral-900"
              class="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition hover:bg-[#ffe49c] hover:text-neutral-900"
              @click="closeMobileNav"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <RouterLink
        to="/member/join-us"
        active-class="bg-brand-yellow font-bold"
        class="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-yellow sm:text-base"
        @click="closeMobileNav"
      >
        加入我們
      </RouterLink>

      <RouterLink
        v-if="authStore.isAdmin"
        to="/admin/products"
        class="inline-flex items-center gap-2 rounded-xl border-2 border-neutral-800 bg-brand-yellow px-3.5 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white sm:text-base"
        @click="closeMobileNav"
      >
        <ShieldCheck class="h-4 w-4" />
        <span>後台商品管理</span>
      </RouterLink>

      <button
        type="button"
        class="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-[#a52a2a] transition hover:bg-[#ffe3de] sm:text-base"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        <span>登出</span>
      </button>
    </nav>
  </aside>
</template>
