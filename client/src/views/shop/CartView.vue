<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

function handleProceedCheckout() {
  if (cartStore.items.length === 0) return

  if (!authStore.isLoggedIn) {
    router.push({
      name: 'login',
      query: { redirect: '/shop/checkout' },
    })
    return
  }

  router.push({ name: 'shop-checkout' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xs">
        <div
          class="flex items-center justify-between border-b-2 border-neutral-800 bg-brand-coral px-6 py-4 text-white"
        >
          <h1 class="text-xl font-black sm:text-2xl">購物車</h1>
          <span class="text-sm font-bold">共 {{ cartStore.totalCount }} 件商品</span>
        </div>

        <!-- 空購物車 -->
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center p-12 text-center">
          <ShoppingBag class="mb-4 h-16 w-16 text-neutral-300" />
          <p class="mb-2 text-lg font-extrabold text-neutral-800">購物車目前是空的</p>
          <p class="mb-6 text-sm text-neutral-500">去商城幫毛孩挑選喜歡的飼料、罐頭或玩具吧！</p>
          <RouterLink
            to="/shop"
            class="rounded-full border-2 border-neutral-800 bg-brand-yellow px-8 py-3 text-base font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          >
            前往商品一覽
          </RouterLink>
        </div>

        <!-- 商品列表與小計 -->
        <div v-else class="p-5 sm:p-8">
          <div class="divide-y divide-neutral-200">
            <article
              v-for="item in cartStore.items"
              :key="item.key"
              class="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <!-- 圖與名稱 -->
              <div class="flex items-center gap-4">
                <RouterLink
                  :to="{ name: 'shop-product', params: { id: item.productId } }"
                  class="shrink-0"
                >
                  <img
                    :src="imgAsset(item.productImg)"
                    :alt="item.productName"
                    class="h-20 w-20 rounded-2xl border border-neutral-200 bg-brand-warm object-contain p-1.5"
                  />
                </RouterLink>
                <div>
                  <RouterLink
                    :to="{ name: 'shop-product', params: { id: item.productId } }"
                    class="text-base font-extrabold text-neutral-900 hover:text-brand-coral"
                  >
                    {{ item.productName }}
                  </RouterLink>
                  <p class="mt-1 text-xs font-semibold text-neutral-500 sm:text-sm">
                    規格：{{ item.productSpec }} ｜ 口味：{{ item.taste }}
                  </p>
                  <p class="mt-1 text-sm font-bold text-neutral-700">單價 NT${{ item.unitPrice }}</p>
                </div>
              </div>

              <!-- 數量與單項總價 -->
              <div class="flex items-center justify-between gap-4 sm:justify-end">
                <div class="inline-flex items-center rounded-full border-2 border-neutral-800 bg-white">
                  <button
                    type="button"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-l-full hover:bg-brand-warm"
                    aria-label="減少數量"
                    @click="cartStore.decrement(item.key)"
                  >
                    <Minus class="h-4 w-4" />
                  </button>
                  <span class="min-w-9 text-center text-sm font-extrabold">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-r-full hover:bg-brand-warm"
                    aria-label="增加數量"
                    @click="cartStore.increment(item.key)"
                  >
                    <Plus class="h-4 w-4" />
                  </button>
                </div>

                <p class="min-w-24 text-right text-base font-black text-brand-coral sm:text-lg">
                  NT${{ item.unitPrice * item.quantity }}
                </p>

                <button
                  type="button"
                  class="cursor-pointer rounded-full p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="移除商品"
                  @click="cartStore.removeItem(item.key)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </article>
          </div>

          <!-- 優惠提示與繼續購物 -->
          <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1 text-sm font-bold text-brand-coral">
              <p>★ 全館商品享 88 折優惠</p>
              <p v-if="cartStore.freeShippingGap > 0">
                再加購 NT${{ cartStore.freeShippingGap }} 即享免運優惠！
              </p>
              <p v-else class="text-emerald-700">已達滿 NT$1,000 免運門檻！</p>
            </div>

            <RouterLink
              to="/shop"
              class="rounded-full border-2 border-neutral-800 bg-white px-5 py-2 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-yellow"
            >
              繼續購物
            </RouterLink>
          </div>

          <div class="my-6 h-1 rounded-full bg-brand-coral"></div>

          <!-- 金額小計與結帳 -->
          <div class="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
            <dl class="w-full max-w-sm space-y-2.5 text-sm sm:text-base md:ml-auto">
              <div class="flex justify-between">
                <dt class="text-neutral-600">商品總金額</dt>
                <dd class="font-bold">NT${{ cartStore.subtotal }}</dd>
              </div>
              <div class="flex justify-between text-[#a52a2a]">
                <dt>優惠折扣（88 折）</dt>
                <dd class="font-bold">-NT${{ cartStore.discountAmount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-600">商品小計</dt>
                <dd class="font-bold">NT${{ cartStore.discountedSubtotal }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-600">運費</dt>
                <dd class="font-bold">NT${{ cartStore.shippingFee }}</dd>
              </div>
              <div
                class="flex justify-between border-t-2 border-neutral-200 pt-3 text-xl font-black text-neutral-900"
              >
                <dt>總計</dt>
                <dd class="text-brand-coral">NT${{ cartStore.finalTotal }}</dd>
              </div>
            </dl>

            <button
              type="button"
              class="h-14 w-full cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-10 text-lg font-black text-neutral-900 transition hover:bg-brand-coral hover:text-white md:w-auto"
              @click="handleProceedCheckout"
            >
              前往結帳
            </button>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
