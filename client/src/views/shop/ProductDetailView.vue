<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowLeft, Minus, Plus, RefreshCw, ShoppingCart } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { getProductByIdApi } from '@/api/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/shop'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const product = ref<Product | null>(null)
const isLoading = ref(true)
const notFound = ref(false)
const errorMessage = ref('')

const selectedSpecIndex = ref(0)
const selectedTaste = ref('')
const quantity = ref(1)
const addedFeedback = ref('')

let fetchSeq = 0

async function loadProduct() {
  const seq = ++fetchSeq
  const id = Number(route.params.id)

  isLoading.value = true
  notFound.value = false
  errorMessage.value = ''
  addedFeedback.value = ''

  if (!Number.isInteger(id) || id <= 0) {
    product.value = null
    notFound.value = true
    isLoading.value = false
    return
  }

  try {
    const data = await getProductByIdApi(id)
    if (seq !== fetchSeq) return

    product.value = data
    selectedSpecIndex.value = 0
    selectedTaste.value = data.tastes[0] ?? ''
    quantity.value = 1
  } catch (err) {
    if (seq !== fetchSeq) return
    product.value = null
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      notFound.value = true
    } else {
      errorMessage.value = '無法載入商品詳情，請確認後端伺服器是否已啟動。'
    }
  } finally {
    if (seq === fetchSeq) {
      isLoading.value = false
    }
  }
}

watch(
  () => route.params.id,
  () => {
    loadProduct()
  },
  { immediate: true },
)

const currentSpec = computed(() => product.value?.specs[selectedSpecIndex.value] ?? null)
const unitPrice = computed(() => currentSpec.value?.price ?? 0)
const totalPrice = computed(() => unitPrice.value * quantity.value)

function decrement() {
  if (quantity.value > 1) quantity.value -= 1
}

function increment() {
  quantity.value += 1
}

function addCurrentProduct() {
  if (!product.value || !currentSpec.value) return false
  cartStore.addItem({
    productId: product.value.id,
    productImg: product.value.image,
    productName: product.value.name,
    productSpec: currentSpec.value.spec,
    taste: selectedTaste.value || '標準',
    unitPrice: currentSpec.value.price,
    quantity: quantity.value,
  })
  return true
}

function handleAddToCart() {
  if (!addCurrentProduct()) return
  addedFeedback.value = '商品已加入購物車！'
}

function handleBuyNow() {
  if (!addCurrentProduct()) return
  router.push({ name: 'shop-cart' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6">
        <RouterLink
          to="/shop"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 transition hover:text-brand-coral"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>返回商品一覽</span>
        </RouterLink>
      </div>

      <!-- 載入中 -->
      <div
        v-if="isLoading"
        class="grid animate-pulse grid-cols-1 gap-8 rounded-3xl border-2 border-neutral-200 bg-white p-6 sm:p-8 lg:grid-cols-2"
      >
        <div class="h-80 rounded-2xl bg-brand-warm"></div>
        <div class="space-y-4">
          <div class="h-6 w-24 rounded-full bg-neutral-200"></div>
          <div class="h-8 w-3/4 rounded bg-neutral-200"></div>
          <div class="h-10 w-1/3 rounded bg-neutral-200"></div>
          <div class="h-24 rounded-2xl bg-neutral-100"></div>
        </div>
      </div>

      <!-- 載入失敗 -->
      <div
        v-else-if="errorMessage"
        class="rounded-3xl border-2 border-red-200 bg-red-50 p-12 text-center"
        role="alert"
      >
        <p class="mb-4 font-bold text-red-700">{{ errorMessage }}</p>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          @click="loadProduct"
        >
          <RefreshCw class="h-4 w-4" />
          <span>重新載入</span>
        </button>
      </div>

      <!-- 找不到商品 -->
      <div
        v-else-if="notFound || !product"
        class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center"
      >
        <p class="mb-4 text-lg font-bold text-neutral-700">找不到此商品</p>
        <RouterLink
          to="/shop"
          class="inline-block rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        >
          回到商城逛逛
        </RouterLink>
      </div>

      <!-- 商品主區塊 -->
      <div
        v-else
        class="grid grid-cols-1 gap-8 rounded-3xl border-2 border-neutral-800 bg-white p-6 sm:p-8 lg:grid-cols-2 lg:gap-12"
      >
        <!-- 左側大圖 -->
        <div class="flex items-center justify-center rounded-2xl bg-brand-warm p-6">
          <img
            :src="imgAsset(product.image)"
            :alt="product.name"
            class="max-h-96 w-full rounded-2xl object-contain"
          />
        </div>

        <!-- 右側選購資訊 -->
        <div class="flex flex-col">
          <div class="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
            <RouterLink
              :to="`/shop/category/${encodeURIComponent(product.category)}`"
              class="rounded-full bg-brand-warm px-3 py-1 text-brand-coral hover:bg-brand-yellow hover:text-neutral-900"
            >
              {{ product.category }}
            </RouterLink>
            <span class="rounded-full bg-red-50 px-3 py-1 text-brand-coral">全館 88 折</span>
            <span class="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              庫存 {{ product.stock }} 件
            </span>
          </div>

          <h1 class="text-2xl font-black text-neutral-900 sm:text-3xl">{{ product.name }}</h1>

          <p class="mt-4 text-3xl font-black text-brand-coral">
            NT${{ totalPrice }}
            <span v-if="quantity > 1" class="ml-2 text-sm font-semibold text-neutral-500">
              （單價 NT${{ unitPrice }}）
            </span>
          </p>

          <!-- 規格選擇 -->
          <div class="mt-6">
            <p class="mb-2 text-sm font-bold text-neutral-700">選擇規格</p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="(specItem, index) in product.specs"
                :key="specItem.specId ?? specItem.spec"
                type="button"
                class="cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition"
                :class="
                  selectedSpecIndex === index
                    ? 'border-neutral-900 bg-brand-yellow text-neutral-900'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-yellow'
                "
                @click="selectedSpecIndex = index"
              >
                {{ specItem.spec }}
              </button>
            </div>
          </div>

          <!-- 口味／款式 -->
          <div v-if="product.tastes.length > 0" class="mt-5">
            <p class="mb-2 text-sm font-bold text-neutral-700">選擇口味／款式</p>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="taste in product.tastes"
                :key="taste"
                type="button"
                class="cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition"
                :class="
                  selectedTaste === taste
                    ? 'border-neutral-900 bg-brand-yellow text-neutral-900'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-yellow'
                "
                @click="selectedTaste = taste"
              >
                {{ taste }}
              </button>
            </div>
          </div>

          <!-- 數量與按鈕 -->
          <div class="mt-6 flex flex-wrap items-center gap-4">
            <div class="inline-flex items-center rounded-full border-2 border-neutral-800 bg-white">
              <button
                type="button"
                class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-full text-neutral-800 transition hover:bg-brand-warm disabled:opacity-40"
                :disabled="quantity <= 1"
                aria-label="減少數量"
                @click="decrement"
              >
                <Minus class="h-4 w-4" />
              </button>
              <span class="min-w-12 text-center text-base font-extrabold">{{ quantity }}</span>
              <button
                type="button"
                class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-full text-neutral-800 transition hover:bg-brand-warm"
                aria-label="增加數量"
                @click="increment"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              class="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 text-base font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
              @click="handleAddToCart"
            >
              <ShoppingCart class="h-5 w-5" />
              <span>加入購物車</span>
            </button>

            <button
              type="button"
              class="h-12 cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-coral px-6 text-base font-extrabold text-white transition hover:opacity-90"
              @click="handleBuyNow"
            >
              立即結帳
            </button>
          </div>

          <div
            v-if="addedFeedback"
            class="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800"
          >
            <span>{{ addedFeedback }}</span>
            <RouterLink to="/shop/cart" class="font-extrabold text-brand-coral hover:underline">
              查看購物車 →
            </RouterLink>
          </div>

          <!-- 商品介紹 -->
          <div class="mt-8 border-t border-neutral-200 pt-6">
            <h2 class="mb-2 text-base font-extrabold text-neutral-900">商品介紹</h2>
            <p class="leading-relaxed text-neutral-700">{{ product.introduction }}</p>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
