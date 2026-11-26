<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Plus, Trash2 } from 'lucide-vue-next'

interface AddressItem {
  id: number
  recipientName: string
  recipientPhone: string
  recipientAddress: string
}

// 已儲存常用收件地址清單（待串接後端地址 API）
const addresses = ref<AddressItem[]>([
  {
    id: 1,
    recipientName: '測試用戶',
    recipientPhone: '0912-345678',
    recipientAddress: '台中市南屯區公益路二段 51 號',
  },
])

const isAdding = ref(false)
const form = ref({
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
})

/**
 * 驗證收件人姓名、手機與地址後新增一筆常用地址
 */
function handleAddAddress() {
  if (
    !form.value.recipientName.trim() ||
    !form.value.recipientPhone.trim() ||
    !form.value.recipientAddress.trim()
  ) {
    return
  }

  // 後續串接 POST /api/member/address 寫入資料庫
  addresses.value.push({
    id: Date.now(),
    recipientName: form.value.recipientName.trim(),
    recipientPhone: form.value.recipientPhone.trim(),
    recipientAddress: form.value.recipientAddress.trim(),
  })

  form.value = { recipientName: '', recipientPhone: '', recipientAddress: '' }
  isAdding.value = false
}

function removeAddress(id: number) {
  addresses.value = addresses.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-black text-neutral-900">常用收件地址</h1>
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-2 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        @click="isAdding = !isAdding"
      >
        <Plus class="h-4 w-4" />
        <span>{{ isAdding ? '取消新增' : '新增常用地址' }}</span>
      </button>
    </div>
    <div class="h-1 rounded-full bg-brand-coral"></div>

    <!-- 新增地址表單 -->
    <form
      v-if="isAdding"
      class="space-y-4 rounded-3xl border-2 border-neutral-800 bg-white p-6"
      @submit.prevent="handleAddAddress"
    >
      <h2 class="text-lg font-extrabold text-neutral-900">新增收件地址</h2>

      <div>
        <label for="recipient-address" class="mb-1 block text-sm font-bold text-neutral-700">
          收件人地址
        </label>
        <input
          id="recipient-address"
          v-model.trim="form.recipientAddress"
          type="text"
          placeholder="請輸入完整地址"
          class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          required
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="recipient-name" class="mb-1 block text-sm font-bold text-neutral-700">
            收件人姓名
          </label>
          <input
            id="recipient-name"
            v-model.trim="form.recipientName"
            type="text"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
        </div>
        <div>
          <label for="recipient-phone" class="mb-1 block text-sm font-bold text-neutral-700">
            收件人手機
          </label>
          <input
            id="recipient-phone"
            v-model.trim="form.recipientPhone"
            type="tel"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
      >
        新增收件地址
      </button>
    </form>

    <!-- 已存地址列表 -->
    <div
      v-if="addresses.length === 0"
      class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500"
    >
      目前尚未新增常用收件地址
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="item in addresses"
        :key="item.id"
        class="flex flex-col justify-between gap-4 rounded-3xl border-2 border-neutral-800 bg-white p-5 sm:flex-row sm:items-center"
      >
        <div class="flex items-start gap-3.5">
          <div class="rounded-2xl bg-brand-yellow/60 p-3">
            <MapPin class="h-6 w-6 text-brand-coral" />
          </div>
          <div>
            <p class="text-base font-extrabold text-neutral-900">
              {{ item.recipientName }}
              <span class="ml-2 text-sm font-semibold text-neutral-500">
                {{ item.recipientPhone }}
              </span>
            </p>
            <p class="mt-1 text-sm text-neutral-700 sm:text-base">{{ item.recipientAddress }}</p>
          </div>
        </div>

        <button
          type="button"
          class="self-end rounded-full border border-neutral-300 p-2 text-neutral-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:self-center cursor-pointer"
          aria-label="刪除收件地址"
          @click="removeAddress(item.id)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </article>
    </div>
  </div>
</template>
