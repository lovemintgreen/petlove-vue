<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { resolveProductImage } from '@/utils/image'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const imgAsset = resolveProductImage

const form = ref({
  recipientName: authStore.user?.name ?? '',
  recipientPhone: authStore.user?.phone ?? '',
  recipientEmail: authStore.user?.email ?? '',
  deliveryMethod: 'home' as 'seven' | 'home',
  address: '',
  paymentMethod: 'credit_card' as 'credit_card' | 'cod',
})

const errorMessage = ref('')

function handleSubmitOrder() {
  errorMessage.value = ''

  if (cartStore.items.length === 0) {
    errorMessage.value = '購物車內沒有商品'
    return
  }

  if (
    !form.value.recipientName.trim() ||
    !form.value.recipientPhone.trim() ||
    !form.value.recipientEmail.trim() ||
    !form.value.address.trim()
  ) {
    errorMessage.value = '請完整填寫收件人資訊與配送地址／門市'
    return
  }

  // 後續串接 POST /api/orders 建立訂單與明細
  const orderNo = `PL${Date.now().toString().slice(-6)}`
  cartStore.clearCart()

  router.replace({
    name: 'shop-order-success',
    query: { orderNo },
  })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream pt-20">
    <AppHeader />

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6">
        <RouterLink
          to="/shop/cart"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 transition hover:text-brand-coral"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>返回購物車</span>
        </RouterLink>
      </div>

      <div
        v-if="cartStore.items.length === 0"
        class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-12 text-center"
      >
        <p class="mb-4 text-lg font-bold text-neutral-700">目前購物車沒有可結帳的商品</p>
        <RouterLink
          to="/shop"
          class="inline-block rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 hover:bg-brand-coral hover:text-white"
        >
          回到商品一覽
        </RouterLink>
      </div>

      <form v-else class="space-y-6" @submit.prevent="handleSubmitOrder" novalidate>
        <div
          v-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <!-- 收件資訊 -->
        <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
          <div class="border-b-2 border-neutral-800 bg-brand-yellow px-6 py-3.5 text-lg font-black">
            收件資訊
          </div>
          <div class="space-y-5 p-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label for="checkout-name" class="mb-1.5 block text-sm font-bold text-neutral-700">
                  姓名
                </label>
                <input
                  id="checkout-name"
                  v-model.trim="form.recipientName"
                  type="text"
                  class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
                  required
                />
              </div>
              <div>
                <label for="checkout-phone" class="mb-1.5 block text-sm font-bold text-neutral-700">
                  電話號碼
                </label>
                <input
                  id="checkout-phone"
                  v-model.trim="form.recipientPhone"
                  type="tel"
                  class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
                  required
                />
              </div>
              <div>
                <label for="checkout-email" class="mb-1.5 block text-sm font-bold text-neutral-700">
                  電子信箱
                </label>
                <input
                  id="checkout-email"
                  v-model.trim="form.recipientEmail"
                  type="email"
                  class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
                  required
                />
              </div>
            </div>

            <div>
              <p class="mb-2 text-sm font-bold text-neutral-700">配送方式</p>
              <div class="flex flex-wrap gap-3">
                <label
                  class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition"
                  :class="
                    form.deliveryMethod === 'seven'
                      ? 'border-neutral-900 bg-brand-yellow/50'
                      : 'border-neutral-300'
                  "
                >
                  <input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="seven"
                    class="accent-brand-coral"
                  />
                  <span>7-11 超商取貨</span>
                </label>

                <label
                  class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition"
                  :class="
                    form.deliveryMethod === 'home'
                      ? 'border-neutral-900 bg-brand-yellow/50'
                      : 'border-neutral-300'
                  "
                >
                  <input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="home"
                    class="accent-brand-coral"
                  />
                  <span>宅配到府</span>
                </label>
              </div>
            </div>

            <div>
              <label for="checkout-address" class="mb-1.5 block text-sm font-bold text-neutral-700">
                {{ form.deliveryMethod === 'seven' ? '7-11 取貨門市名稱／地址' : '收件地址' }}
              </label>
              <input
                id="checkout-address"
                v-model.trim="form.address"
                type="text"
                :placeholder="
                  form.deliveryMethod === 'seven'
                    ? '例如 7-11 公益門市（台中市南屯區...）'
                    : '請輸入完整宅配地址'
                "
                class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
                required
              />
            </div>
          </div>
        </section>

        <!-- 付款方式 -->
        <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
          <div class="border-b-2 border-neutral-800 bg-brand-yellow px-6 py-3.5 text-lg font-black">
            付款方式
          </div>
          <div class="flex flex-wrap gap-3 p-6">
            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition"
              :class="
                form.paymentMethod === 'credit_card'
                  ? 'border-neutral-900 bg-brand-yellow/50'
                  : 'border-neutral-300'
              "
            >
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="credit_card"
                class="accent-brand-coral"
              />
              <span>信用卡付款 Visa / MasterCard</span>
            </label>

            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition"
              :class="
                form.paymentMethod === 'cod'
                  ? 'border-neutral-900 bg-brand-yellow/50'
                  : 'border-neutral-300'
              "
            >
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="cod"
                class="accent-brand-coral"
              />
              <span>超商取貨付款</span>
            </label>
          </div>
        </section>

        <!-- 訂購商品明細 -->
        <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
          <div class="border-b-2 border-neutral-800 bg-brand-yellow px-6 py-3.5 text-lg font-black">
            訂購商品明細
          </div>
          <div class="divide-y divide-neutral-200 p-6">
            <div
              v-for="item in cartStore.items"
              :key="item.key"
              class="flex flex-col justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
            >
              <div class="flex items-center gap-3.5">
                <img
                  :src="imgAsset(item.productImg)"
                  :alt="item.productName"
                  class="h-16 w-16 rounded-xl border border-neutral-200 bg-brand-warm object-contain p-1"
                />
                <div>
                  <p class="font-extrabold text-neutral-900">{{ item.productName }}</p>
                  <p class="text-xs font-semibold text-neutral-500">
                    規格：{{ item.productSpec }} ｜ 口味：{{ item.taste }}
                  </p>
                </div>
              </div>
              <p class="text-right text-sm font-bold text-neutral-800 sm:text-base">
                NT${{ item.unitPrice }} × {{ item.quantity }} =
                <span class="text-brand-coral">NT${{ item.unitPrice * item.quantity }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- 金額結算與送出 -->
        <section class="rounded-3xl border-2 border-neutral-800 bg-white p-6">
          <div class="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
            <dl class="w-full max-w-sm space-y-2 text-sm sm:text-base md:ml-auto">
              <div class="flex justify-between">
                <dt class="text-neutral-600">商品總金額</dt>
                <dd class="font-bold">NT${{ cartStore.subtotal }}</dd>
              </div>
              <div class="flex justify-between text-[#a52a2a]">
                <dt>優惠折扣（88 折）</dt>
                <dd class="font-bold">-NT${{ cartStore.discountAmount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-600">運費</dt>
                <dd class="font-bold">NT${{ cartStore.shippingFee }}</dd>
              </div>
              <div
                class="flex justify-between border-t-2 border-neutral-200 pt-2.5 text-xl font-black text-neutral-900"
              >
                <dt>應付總計</dt>
                <dd class="text-brand-coral">NT${{ cartStore.finalTotal }}</dd>
              </div>
            </dl>

            <button
              type="submit"
              class="h-14 w-full cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-coral px-10 text-lg font-black text-white transition hover:opacity-90 md:w-auto"
            >
              確認送出訂單
            </button>
          </div>
        </section>
      </form>
    </main>

    <AppFooter />
  </div>
</template>
