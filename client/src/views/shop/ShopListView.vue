<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import QuickAddCartModal from '@/components/QuickAddCartModal.vue'
import {
  MOCK_PRODUCTS,
  SHOP_CATEGORIES,
  getProductPriceRange,
} from '@/data/mockProducts'
import type { Product } from '@/types/shop'

const route = useRoute()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const PAGE_SIZE = 6
const currentPage = ref(1)
const searchKeyword = ref('')
const modalProduct = ref<Product | null>(null)
const toastMessage = ref('')

let toastTimer: ReturnType<typeof setTimeout> | null = null

const activeCategory = computed(() => {
  const param = route.params.category
  return typeof param === 'string' && param.trim() ? decodeURIComponent(param) : ''
})

const filteredProducts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return MOCK_PRODUCTS.filter((item) => {
    const matchCategory = !activeCategory.value || item.category === activeCategory.value
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    return matchCategory && matchKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

watch([activeCategory, searchKeyword], () => {
  currentPage.value = 1
})

function formatPriceRange(product: Product): string {
  const { min, max } = getProductPriceRange(product)
  return min === max ? `NT$${min}` : `NT$${min} - ${max}`
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleAddedToast(productName: string) {
  toastMessage.value = `已將「${productName}」加入購物車`
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <!-- 加入購物車提示 -->
    <div
      v-if="toastMessage"
      class="fixed right-4 bottom-6 z-40 rounded-2xl border-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-sm font-extrabold text-neutral-900 shadow-lg sm:right-6"
      role="status"
    >
      {{ toastMessage }}
    </div>

    <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <!-- 標題與搜尋列 -->
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-black text-neutral-900 sm:text-3xl">
            {{ activeCategory || '全部商品' }}
          </h1>
          <p class="mt-1 text-sm text-neutral-500">
            共 {{ filteredProducts.length }} 項精選毛孩商品｜全館享 88 折、滿 NT$1,000 免運
          </p>
        </div>

        <div class="relative w-full sm:w-72">
          <Search
            class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="搜尋商品名稱..."
            class="h-11 w-full rounded-full border-2 border-neutral-800 bg-white pr-4 pl-10 text-sm outline-none transition focus:border-brand-coral"
          />
        </div>
      </div>

      <!-- 手機／平板水平分類膠囊列 -->
      <nav
        class="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden"
        aria-label="商品分類"
      >
        <RouterLink
          to="/shop"
          class="shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition"
          :class="
            !activeCategory
              ? 'border-neutral-900 bg-brand-yellow text-neutral-900'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-coral'
          "
        >
          全部商品
        </RouterLink>
        <RouterLink
          v-for="cat in SHOP_CATEGORIES"
          :key="cat"
          :to="`/shop/category/${encodeURIComponent(cat)}`"
          class="shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-bold transition"
          :class="
            activeCategory === cat
              ? 'border-neutral-900 bg-brand-yellow text-neutral-900'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-coral'
          "
        >
          {{ cat }}
        </RouterLink>
      </nav>

      <div class="flex flex-col gap-8 lg:flex-row">
        <!-- 桌機左側分類欄 -->
        <aside class="hidden w-56 shrink-0 lg:block" aria-label="商品分類導覽">
          <div class="sticky top-28 overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
            <div class="border-b-2 border-neutral-800 bg-brand-coral px-5 py-3 text-base font-extrabold text-white">
              商品分類
            </div>
            <ul class="space-y-1 p-3">
              <li>
                <RouterLink
                  to="/shop"
                  class="block rounded-xl px-4 py-2.5 text-base font-bold transition"
                  :class="
                    !activeCategory
                      ? 'bg-brand-yellow text-neutral-900'
                      : 'text-neutral-700 hover:bg-brand-warm'
                  "
                >
                  全部商品
                </RouterLink>
              </li>
              <li v-for="cat in SHOP_CATEGORIES" :key="cat">
                <RouterLink
                  :to="`/shop/category/${encodeURIComponent(cat)}`"
                  class="block rounded-xl px-4 py-2.5 text-base font-bold transition"
                  :class="
                    activeCategory === cat
                      ? 'bg-brand-yellow text-neutral-900'
                      : 'text-neutral-700 hover:bg-brand-warm'
                  "
                >
                  {{ cat }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </aside>

        <!-- 商品卡片區 -->
        <section class="flex-1">
          <div
            v-if="paginatedProducts.length === 0"
            class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500"
          >
            找不到符合條件的商品，請換個關鍵字或分類試試！
          </div>

          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="productItem in paginatedProducts"
              :key="productItem.id"
              class="flex flex-col overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <RouterLink
                :to="{ name: 'shop-product', params: { id: productItem.id } }"
                class="flex flex-1 flex-col"
              >
                <div class="aspect-square w-full overflow-hidden bg-brand-warm p-4">
                  <img
                    :src="imgAsset(productItem.image)"
                    :alt="productItem.name"
                    class="h-full w-full rounded-2xl object-contain transition duration-300 hover:scale-105"
                  />
                </div>
                <div class="flex flex-1 flex-col p-4 pb-2">
                  <span
                    class="mb-1.5 w-fit rounded-full bg-brand-warm px-2.5 py-0.5 text-xs font-bold text-brand-coral"
                  >
                    {{ productItem.category }}
                  </span>
                  <h2 class="line-clamp-2 text-base font-extrabold text-neutral-900">
                    {{ productItem.name }}
                  </h2>
                  <p class="mt-auto pt-3 text-lg font-black text-brand-coral">
                    {{ formatPriceRange(productItem) }}
                  </p>
                </div>
              </RouterLink>

              <div class="p-4 pt-2">
                <button
                  type="button"
                  class="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
                  @click="modalProduct = productItem"
                >
                  <ShoppingCart class="h-4 w-4" />
                  <span>加入購物車</span>
                </button>
              </div>
            </article>
          </div>

          <!-- 分頁器 -->
          <nav
            v-if="totalPages > 1"
            class="mt-10 flex items-center justify-center gap-2"
            aria-label="商品分頁"
          >
            <button
              type="button"
              class="inline-flex h-10 cursor-pointer items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-4 text-sm font-bold text-neutral-800 transition hover:bg-brand-yellow disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              <ChevronLeft class="h-4 w-4" />
              <span>上一頁</span>
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-extrabold transition"
              :class="
                currentPage === page
                  ? 'border-neutral-900 bg-brand-coral text-white'
                  : 'border-neutral-800 bg-white text-neutral-800 hover:bg-brand-yellow'
              "
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

            <button
              type="button"
              class="inline-flex h-10 cursor-pointer items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-4 text-sm font-bold text-neutral-800 transition hover:bg-brand-yellow disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <span>下一頁</span>
              <ChevronRight class="h-4 w-4" />
            </button>
          </nav>
        </section>
      </div>
    </div>

    <QuickAddCartModal
      :product="modalProduct"
      @close="modalProduct = null"
      @added="handleAddedToast"
    />

    <AppFooter />
  </div>
</template>
