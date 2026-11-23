<script setup lang="ts">
import { ref } from 'vue'
import { CreditCard, Plus, Trash2 } from 'lucide-vue-next'

interface PaymentCard {
  id: number
  cardNumber: string
  holderName: string
  holderPhone: string
}

const cards = ref<PaymentCard[]>([
  {
    id: 1,
    cardNumber: 'XXXX-XXXX-XXXX-0912',
    holderName: '愛遛狗小姐姐',
    holderPhone: '0912-345678',
  },
])

const isAdding = ref(false)
const editingCardId = ref<number | null>(null)
const newCard = ref({ cardNumber: '', holderName: '', holderPhone: '' })
const editDraft = ref({ cardNumber: '', holderName: '', holderPhone: '' })

function maskCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length >= 4) {
    return `XXXX-XXXX-XXXX-${digits.slice(-4)}`
  }
  return raw
}

function handleAddCard() {
  if (!newCard.value.cardNumber.trim() || !newCard.value.holderName.trim()) return
  cards.value.push({
    id: Date.now(),
    cardNumber: maskCardNumber(newCard.value.cardNumber.trim()),
    holderName: newCard.value.holderName.trim(),
    holderPhone: newCard.value.holderPhone.trim() || '未填寫',
  })
  newCard.value = { cardNumber: '', holderName: '', holderPhone: '' }
  isAdding.value = false
}

function startEdit(card: PaymentCard) {
  editingCardId.value = card.id
  editDraft.value = {
    cardNumber: card.cardNumber,
    holderName: card.holderName,
    holderPhone: card.holderPhone,
  }
}

function saveEdit(cardId: number) {
  const target = cards.value.find((c) => c.id === cardId)
  if (!target) return
  target.cardNumber = editDraft.value.cardNumber.trim()
  target.holderName = editDraft.value.holderName.trim()
  target.holderPhone = editDraft.value.holderPhone.trim()
  editingCardId.value = null
}

function removeCard(cardId: number) {
  cards.value = cards.value.filter((c) => c.id !== cardId)
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-black text-neutral-900">付款方式管理</h1>
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-2 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        @click="isAdding = !isAdding"
      >
        <Plus class="h-4 w-4" />
        <span>{{ isAdding ? '取消新增' : '新增付款方式' }}</span>
      </button>
    </div>
    <div class="h-1 rounded-full bg-brand-coral"></div>

    <!-- 新增信用卡表單 -->
    <form
      v-if="isAdding"
      class="space-y-4 rounded-3xl border-2 border-neutral-800 bg-white p-6"
      @submit.prevent="handleAddCard"
    >
      <h2 class="text-lg font-extrabold text-neutral-900">新增信用卡</h2>
      <div>
        <label for="card-number" class="mb-1 block text-sm font-bold text-neutral-700">
          信用卡卡號
        </label>
        <input
          id="card-number"
          v-model.trim="newCard.cardNumber"
          type="text"
          placeholder="例如 1234-5678-9012-3456"
          class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          required
        />
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="card-holder" class="mb-1 block text-sm font-bold text-neutral-700">
            持卡人姓名
          </label>
          <input
            id="card-holder"
            v-model.trim="newCard.holderName"
            type="text"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
        </div>
        <div>
          <label for="card-phone" class="mb-1 block text-sm font-bold text-neutral-700">
            持卡人手機
          </label>
          <input
            id="card-phone"
            v-model.trim="newCard.holderPhone"
            type="tel"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          />
        </div>
      </div>
      <button
        type="submit"
        class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
      >
        儲存信用卡
      </button>
    </form>

    <!-- 已綁定卡片列表 -->
    <div v-if="cards.length === 0" class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
      目前尚未綁定任何付款方式
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="card in cards"
        :key="card.id"
        class="rounded-3xl border-2 border-neutral-800 bg-white p-5"
      >
        <div v-if="editingCardId === card.id" class="space-y-3">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              v-model.trim="editDraft.cardNumber"
              type="text"
              class="h-10 rounded-xl border-2 border-neutral-800 px-3 text-sm"
            />
            <input
              v-model.trim="editDraft.holderName"
              type="text"
              class="h-10 rounded-xl border-2 border-neutral-800 px-3 text-sm"
            />
            <input
              v-model.trim="editDraft.holderPhone"
              type="tel"
              class="h-10 rounded-xl border-2 border-neutral-800 px-3 text-sm"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="cursor-pointer rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-bold text-neutral-600"
              @click="editingCardId = null"
            >
              取消
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-1.5 text-sm font-bold"
              @click="saveEdit(card.id)"
            >
              儲存
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex items-start gap-3.5">
            <div class="rounded-2xl bg-brand-yellow/60 p-3">
              <CreditCard class="h-6 w-6 text-neutral-900" />
            </div>
            <div>
              <p class="text-sm font-bold text-neutral-500">信用卡</p>
              <p class="font-mono text-base font-extrabold text-neutral-900">
                {{ card.cardNumber }}
              </p>
              <p class="mt-1 text-sm text-neutral-600">
                {{ card.holderName }} ｜ {{ card.holderPhone }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-coral px-4 py-1.5 text-sm font-bold text-white transition hover:opacity-90"
              @click="startEdit(card)"
            >
              管理
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-full border border-neutral-300 p-2 text-neutral-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              aria-label="刪除信用卡"
              @click="removeCard(card.id)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
