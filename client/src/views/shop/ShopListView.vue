<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, RefreshCw, Search, ShoppingCart } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import QuickAddCartModal from '@/components/QuickAddCartModal.vue'
import { getCategoriesApi, getProductsApi } from '@/api/products'
import { resolveProductImage } from '@/utils/image'
import type { PaginationMeta, Product } from '@/types/shop'

const route = useRoute()

const imgAsset = resolveProductImage

const PAGE_SIZE = 6

const categories = ref<string[]>([])
const products = ref<Product[]>([])
const pagination = ref<PaginationMeta>({
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
})

const currentPage = ref(1)
const searchKeyword = ref('')
const debouncedKeyword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const modalProduct = ref<Product | null>(null)
const toastMessage = ref('')

let searchTimer: ReturnType<typeof setTimeout> | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null
let fetchSeq = 0

const activeCategory = computed(() => {
  const param = route.params.category
  return typeof param === 'string' && param.trim() ? decodeURIComponent(param) : ''
})

async function loadCategories() {
  try {
    categories.value = await getCategoriesApi()
  } catch (err) {
    console.error('載入商品分類失敗', err)
  }
}

async function loadProducts() {
  const seq = ++fetchSeq
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await getProductsApi({
      category: activeCategory.value || undefined,
      keyword: debouncedKeyword.value || undefined,
      page: currentPage.value,
      limit: PAGE_SIZE,
    })

    if (seq !== fetchSeq) return

    products.value = result.data
    pagination.value = result.pagination
    currentPage.value = result.pagination.page
  } catch (err) {
    if (seq !== fetchSeq) return
    console.error('載入商品列表失敗', err)
    errorMessage.value = '無法載入商品資料，請確認後端伺服器與資料庫已啟動。'
    products.value = []
  } finally {
    if (seq === fetchSeq) {
      isLoading.value = false
    }
  }
}

watch(searchKeyword, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedKeyword.value = value.trim()
  }, 300)
})

watch([activeCategory, debouncedKeyword], () => {
  currentPage.value = 1
  loadProducts()
})

onMounted(() => {
  loadCategories()
  loadProducts()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  if (toastTimer) clearTimeout(toastTimer)
})

function formatPriceRange(product: Product): string {
  return product.minPrice === product.maxPrice
    ? `NT$${product.minPrice}`
    : `NT$${product.minPrice} - ${product.maxPrice}`
}

function goToPage(page: number) {
  if (page < 1 || page > pagination.value.totalPages || page === currentPage.value) return
  currentPage.value = page
  loadProducts()
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
            共 {{ pagination.total }} 項精選毛孩商品｜全館享 88 折、滿 NT$1,000 免運
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
      <nav class="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="商品分類">
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
          v-for="cat in categories"
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
            <div
              class="border-b-2 border-neutral-800 bg-brand-coral px-5 py-3 text-base font-extrabold text-white"
            >
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
              <li v-for="cat in categories" :key="cat">
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
          <!-- 載入中 -->
          <div
            v-if="isLoading"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="商品載入中"
          >
            <div
              v-for="n in PAGE_SIZE"
              :key="n"
              class="h-96 animate-pulse rounded-3xl border-2 border-neutral-200 bg-white p-4"
            >
              <div class="mb-4 h-52 rounded-2xl bg-brand-warm"></div>
              <div class="mb-2 h-4 w-1/3 rounded bg-neutral-200"></div>
              <div class="mb-4 h-5 w-3/4 rounded bg-neutral-200"></div>
              <div class="mt-auto h-10 rounded-full bg-neutral-200"></div>
            </div>
          </div>

          <!-- 載入失敗 -->
          <div
            v-else-if="errorMessage"
            class="rounded-3xl border-2 border-red-200 bg-red-50 p-10 text-center"
            role="alert"
          >
            <p class="mb-4 font-bold text-red-700">{{ errorMessage }}</p>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
              @click="
                () => {
                  loadCategories()
                  loadProducts()
                }
              "
            >
              <RefreshCw class="h-4 w-4" />
              <span>重新載入</span>
            </button>
          </div>

          <!-- 無資料 -->
          <div
            v-else-if="products.length === 0"
            class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500"
          >
            找不到符合條件的商品，請換個關鍵字或分類試試！
          </div>

          <!-- 商品卡片 -->
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="productItem in products"
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
            v-if="!isLoading && !errorMessage && pagination.totalPages > 1"
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
              v-for="page in pagination.totalPages"
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
              :disabled="currentPage >= pagination.totalPages"
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
