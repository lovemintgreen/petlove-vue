<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-vue-next'
import { deleteProductApi, getCategoriesApi, getProductsApi } from '@/api/products'
import { resolveProductImage } from '@/utils/image'
import type { PaginationMeta, Product } from '@/types/shop'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 10

// 商品清單與分頁狀態
const categories = ref<string[]>([])
const products = ref<Product[]>([])
const pagination = ref<PaginationMeta>({
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
})

// 篩選、搜尋與頁面提示狀態
const selectedCategory = ref('')
const searchKeyword = ref('')
const debouncedKeyword = ref('')
const currentPage = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')
const bannerMessage = ref('')

// 刪除確認彈窗目標商品
const deleteTarget = ref<Product | null>(null)
const isDeleting = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null
// 遞增請求序號，防止較慢回傳的舊請求覆蓋最新查詢結果（防競態條件）
let fetchSeq = 0

async function loadCategories() {
  try {
    categories.value = await getCategoriesApi()
  } catch (err) {
    console.error('載入商品分類失敗', err)
  }
}

/**
 * 依目前分類、關鍵字與頁碼向後端取得後台商品列表
 */
async function loadProducts() {
  const seq = ++fetchSeq
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await getProductsApi({
      category: selectedCategory.value || undefined,
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

// 搜尋關鍵字防抖 300ms，避免每次輸入都發送 API 請求
watch(searchKeyword, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedKeyword.value = value.trim()
  }, 300)
})

// 切換分類或搜尋關鍵字時重設回第 1 頁並重新查詢
watch([selectedCategory, debouncedKeyword], () => {
  currentPage.value = 1
  loadProducts()
})

onMounted(() => {
  // 接收新增／編輯頁導回時夾帶的操作成功訊息，並清掉網址 query
  if (typeof route.query.notice === 'string' && route.query.notice) {
    bannerMessage.value = route.query.notice
    router.replace({ name: 'admin-products' })
  }
  loadCategories()
  loadProducts()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
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

/**
 * 確認刪除商品，並同步重新載入分類與商品列表
 */
async function confirmDelete() {
  if (!deleteTarget.value || isDeleting.value) return
  isDeleting.value = true
  errorMessage.value = ''

  try {
    const targetName = deleteTarget.value.name
    await deleteProductApi(deleteTarget.value.id)
    deleteTarget.value = null
    bannerMessage.value = `已刪除商品「${targetName}」`
    await Promise.all([loadCategories(), loadProducts()])
  } catch (err) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      errorMessage.value = err.response?.data?.message || '刪除商品失敗'
    } else {
      errorMessage.value = '刪除商品失敗'
    }
    deleteTarget.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 頁首 -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-black text-neutral-900">商品管理</h1>
        <p class="mt-1 text-sm text-neutral-500">共 {{ pagination.total }} 件商品</p>
      </div>

      <RouterLink
        :to="{ name: 'admin-product-new' }"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
      >
        <Plus class="h-4 w-4" />
        <span>上架新商品</span>
      </RouterLink>
    </div>

    <!-- 提示訊息 -->
    <div
      v-if="bannerMessage"
      class="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
      role="status"
    >
      <span>{{ bannerMessage }}</span>
      <button
        type="button"
        class="cursor-pointer text-xs font-bold underline"
        @click="bannerMessage = ''"
      >
        關閉
      </button>
    </div>

    <!-- 篩選工具列 -->
    <div class="flex flex-col gap-3 rounded-2xl border-2 border-neutral-800 bg-white p-4 sm:flex-row">
      <div class="relative flex-1">
        <Search
          class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400"
        />
        <input
          v-model="searchKeyword"
          type="search"
          placeholder="搜尋商品名稱或介紹..."
          class="h-10 w-full rounded-xl border-2 border-neutral-300 pr-4 pl-10 text-sm outline-none focus:border-brand-coral"
        />
      </div>

      <select
        v-model="selectedCategory"
        class="h-10 rounded-xl border-2 border-neutral-300 bg-white px-3.5 text-sm font-semibold text-neutral-800 outline-none focus:border-brand-coral sm:w-44"
        aria-label="篩選分類"
      >
        <option value="">全部分類</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- 載入中 -->
    <div
      v-if="isLoading"
      class="space-y-3 rounded-3xl border-2 border-neutral-200 bg-white p-6"
    >
      <div v-for="n in 4" :key="n" class="h-16 animate-pulse rounded-2xl bg-brand-warm"></div>
    </div>

    <!-- 錯誤提示 -->
    <div
      v-else-if="errorMessage"
      class="rounded-3xl border-2 border-red-200 bg-red-50 p-8 text-center"
      role="alert"
    >
      <p class="mb-4 font-bold text-red-700">{{ errorMessage }}</p>
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-2 text-sm font-extrabold text-neutral-900 hover:bg-brand-coral hover:text-white"
        @click="loadProducts"
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
      目前沒有符合條件的商品
    </div>

    <template v-else>
      <!-- 桌機表格 -->
      <div class="hidden overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white lg:block">
        <table class="w-full text-left text-sm">
          <thead class="border-b-2 border-neutral-800 bg-brand-yellow text-neutral-900">
            <tr>
              <th class="px-4 py-3.5 font-extrabold">商品</th>
              <th class="px-4 py-3.5 font-extrabold">分類</th>
              <th class="px-4 py-3.5 font-extrabold">規格數</th>
              <th class="px-4 py-3.5 font-extrabold">價格區間</th>
              <th class="px-4 py-3.5 font-extrabold">庫存</th>
              <th class="px-4 py-3.5 text-right font-extrabold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr v-for="item in products" :key="item.id" class="hover:bg-brand-warm/40">
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="resolveProductImage(item.image)"
                    :alt="item.name"
                    class="h-14 w-14 shrink-0 rounded-xl border border-neutral-200 bg-brand-warm object-contain p-1"
                  />
                  <div>
                    <p class="font-extrabold text-neutral-900">{{ item.name }}</p>
                    <p class="text-xs text-neutral-400">ID #{{ item.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span class="rounded-full bg-brand-warm px-3 py-1 text-xs font-bold text-brand-coral">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-4 py-3.5 font-semibold text-neutral-700">
                {{ item.specs.length }} 組
              </td>
              <td class="px-4 py-3.5 font-extrabold text-brand-coral">
                {{ formatPriceRange(item) }}
              </td>
              <td class="px-4 py-3.5 font-bold text-neutral-800">{{ item.stock }}</td>
              <td class="px-4 py-3.5 text-right">
                <div class="inline-flex items-center gap-2">
                  <RouterLink
                    :to="{ name: 'admin-product-edit', params: { id: item.id } }"
                    class="inline-flex items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-900 transition hover:bg-brand-yellow"
                  >
                    <Pencil class="h-3.5 w-3.5" />
                    <span>編輯</span>
                  </RouterLink>
                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-600 hover:text-white"
                    @click="deleteTarget = item"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                    <span>刪除</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 手機／平板卡片清單 -->
      <div class="space-y-4 lg:hidden">
        <article
          v-for="item in products"
          :key="item.id"
          class="rounded-3xl border-2 border-neutral-800 bg-white p-4"
        >
          <div class="flex items-start gap-3.5">
            <img
              :src="resolveProductImage(item.image)"
              :alt="item.name"
              class="h-18 w-18 shrink-0 rounded-2xl border border-neutral-200 bg-brand-warm object-contain p-1"
            />
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-brand-warm px-2.5 py-0.5 text-xs font-bold text-brand-coral">
                  {{ item.category }}
                </span>
                <span class="text-xs text-neutral-400">#{{ item.id }}</span>
              </div>
              <h2 class="mt-1 text-base font-extrabold text-neutral-900">{{ item.name }}</h2>
              <p class="mt-1 text-sm font-black text-brand-coral">
                {{ formatPriceRange(item) }}
                <span class="ml-2 text-xs font-semibold text-neutral-500">
                  庫存 {{ item.stock }} ｜ {{ item.specs.length }} 組規格
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2 border-t border-neutral-200 pt-3">
            <RouterLink
              :to="{ name: 'admin-product-edit', params: { id: item.id } }"
              class="inline-flex items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-4 py-1.5 text-xs font-bold text-neutral-900 hover:bg-brand-yellow"
            >
              <Pencil class="h-3.5 w-3.5" />
              <span>編輯</span>
            </RouterLink>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white"
              @click="deleteTarget = item"
            >
              <Trash2 class="h-3.5 w-3.5" />
              <span>刪除</span>
            </button>
          </div>
        </article>
      </div>

      <!-- 分頁 -->
      <nav
        v-if="pagination.totalPages > 1"
        class="flex items-center justify-center gap-2 pt-2"
        aria-label="後台商品分頁"
      >
        <button
          type="button"
          class="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-3.5 text-xs font-bold disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
          <span>上一頁</span>
        </button>

        <span class="px-2 text-sm font-bold text-neutral-700">
          {{ currentPage }} / {{ pagination.totalPages }}
        </span>

        <button
          type="button"
          class="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-3.5 text-xs font-bold disabled:opacity-40"
          :disabled="currentPage >= pagination.totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <span>下一頁</span>
          <ChevronRight class="h-4 w-4" />
        </button>
      </nav>
    </template>

    <!-- 刪除確認彈窗 -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      @click.self="deleteTarget = null"
    >
      <div class="w-full max-w-md rounded-3xl border-2 border-neutral-800 bg-white p-6 shadow-xl">
        <h3 class="text-lg font-black text-neutral-900">確認刪除商品？</h3>
        <p class="mt-2 text-sm text-neutral-600">
          確定要刪除「<span class="font-bold text-neutral-900">{{ deleteTarget.name }}</span>」嗎？此操作會一併移除其所有規格且無法復原。
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="cursor-pointer rounded-full border border-neutral-300 px-5 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
            :disabled="isDeleting"
            @click="deleteTarget = null"
          >
            取消
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-full border-2 border-neutral-800 bg-red-600 px-5 py-2 text-sm font-extrabold text-white hover:bg-red-700 disabled:opacity-60"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            {{ isDeleting ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
