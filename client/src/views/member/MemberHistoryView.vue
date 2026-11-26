<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface OrderDetailItem {
  id: number
  productName: string
  specification: string
  category: string
  price: number
  subtotal: number
  deliveryMethod: string
  discount: number
  paymentMethod: string
  totalAmount: number
}

interface OrderRecord {
  orderId: string
  orderDate: string
  pickupStatus: string
  details: OrderDetailItem[]
}

// 後續串接 /api/member/history 取得真實訂單紀錄
const orders = ref<OrderRecord[]>([
  {
    orderId: '#254',
    orderDate: '2026-11-18',
    pickupStatus: '配送中',
    details: [
      {
        id: 1,
        productName: '貓用｜1種肉低敏無膠主食罐 × 2',
        specification: '80g',
        category: '雞肉',
        price: 200,
        subtotal: 400,
        deliveryMethod: '宅配',
        discount: 50,
        paymentMethod: '信用卡',
        totalAmount: 350,
      },
    ],
  },
])

// 記錄已展開明細的訂單編號列表，預設展開第一筆訂單
const expandedOrderIds = ref<string[]>(['#254'])

/**
 * 切換指定訂單的商品明細手風琴展開狀態
 */
function toggleDetails(orderId: string) {
  if (expandedOrderIds.value.includes(orderId)) {
    expandedOrderIds.value = expandedOrderIds.value.filter((id) => id !== orderId)
  } else {
    expandedOrderIds.value.push(orderId)
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="mb-2 text-2xl font-black text-neutral-900">商品訂單記錄</h1>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div v-if="orders.length === 0" class="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
      目前尚無商品訂單記錄
    </div>

    <div v-else class="space-y-6">
      <article
        v-for="order in orders"
        :key="order.orderId"
        class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xs"
      >
        <!-- 訂單摘要 -->
        <div class="grid grid-cols-1 gap-4 border-b border-neutral-200 bg-brand-yellow/40 p-5 sm:grid-cols-3">
          <div>
            <p class="text-xs font-semibold text-neutral-500">訂單編號</p>
            <p class="text-lg font-extrabold text-neutral-900">{{ order.orderId }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500">下單日期</p>
            <p class="text-base font-bold text-neutral-800">{{ order.orderDate }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500">取貨狀態</p>
            <span
              class="mt-0.5 inline-block rounded-full bg-brand-coral px-3 py-0.5 text-sm font-bold text-white"
            >
              {{ order.pickupStatus }}
            </span>
          </div>
        </div>

        <!-- 展開明細按鈕 -->
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left text-base font-bold text-neutral-900 transition hover:bg-brand-warm"
          :aria-expanded="expandedOrderIds.includes(order.orderId)"
          @click="toggleDetails(order.orderId)"
        >
          <span>商品明細</span>
          <ChevronDown
            class="h-5 w-5 transition-transform duration-200"
            :class="{ 'rotate-180': expandedOrderIds.includes(order.orderId) }"
          />
        </button>

        <!-- 明細內容 -->
        <div
          v-show="expandedOrderIds.includes(order.orderId)"
          class="border-t border-neutral-200 px-5 py-5"
        >
          <div v-for="detail in order.details" :key="detail.id" class="space-y-4">
            <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <p class="text-base font-extrabold text-neutral-900">{{ detail.productName }}</p>
                <p class="mt-1 text-sm text-neutral-500">
                  規格：{{ detail.specification }} ｜ 口味／分類：{{ detail.category }}
                </p>
              </div>
              <p class="text-base font-bold text-neutral-900">NT${{ detail.price }}</p>
            </div>

            <div class="h-0.5 bg-brand-coral/70"></div>

            <dl class="space-y-2 text-sm sm:text-base">
              <div class="flex justify-between">
                <dt class="text-neutral-600">小計</dt>
                <dd class="font-semibold">NT${{ detail.subtotal }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-600">配送方式</dt>
                <dd class="font-semibold">{{ detail.deliveryMethod }}</dd>
              </div>
              <div class="flex justify-between text-[#a52a2a]">
                <dt>折扣</dt>
                <dd class="font-semibold">-NT${{ detail.discount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-600">付款方式</dt>
                <dd class="font-semibold">{{ detail.paymentMethod }}</dd>
              </div>
              <div class="flex justify-between border-t border-neutral-200 pt-2.5 text-lg font-black text-neutral-900">
                <dt>總計</dt>
                <dd class="text-brand-coral">NT${{ detail.totalAmount }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
