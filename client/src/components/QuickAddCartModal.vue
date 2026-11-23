<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Minus, Plus, ShoppingCart, X } from 'lucide-vue-next'
import type { Product } from '@/types/shop'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  close: []
  added: [productName: string]
}>()

const cartStore = useCartStore()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const selectedSpecIndex = ref(0)
const selectedTaste = ref('')
const quantity = ref(1)

watch(
  () => props.product,
  (product) => {
    if (!product) return
    selectedSpecIndex.value = 0
    selectedTaste.value = product.tastes[0] ?? ''
    quantity.value = 1
  },
  { immediate: true },
)

const currentSpec = computed(() => props.product?.specs[selectedSpecIndex.value] ?? null)
const unitPrice = computed(() => currentSpec.value?.price ?? 0)
const totalPrice = computed(() => unitPrice.value * quantity.value)

function decrement() {
  if (quantity.value > 1) quantity.value -= 1
}

function increment() {
  quantity.value += 1
}

function handleAddToCart() {
  if (!props.product || !currentSpec.value) return

  cartStore.addItem({
    productId: props.product.id,
    productImg: props.product.image,
    productName: props.product.name,
    productSpec: currentSpec.value.spec,
    taste: selectedTaste.value || '標準',
    unitPrice: currentSpec.value.price,
    quantity: quantity.value,
  })

  emit('added', props.product.name)
  emit('close')
}
</script>

<template>
  <div
    v-if="product"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-lg overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xl"
    >
      <div
        class="flex items-center justify-between border-b-2 border-neutral-800 bg-brand-yellow px-5 py-4"
      >
        <h2 class="text-lg font-black text-neutral-900">選擇規格加入購物車</h2>
        <button
          type="button"
          class="cursor-pointer rounded-full p-1 text-neutral-800 transition hover:bg-black/10"
          aria-label="關閉視窗"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-5 p-5 sm:p-6">
        <div class="flex items-center gap-4">
          <img
            :src="imgAsset(product.image)"
            :alt="product.name"
            class="h-20 w-20 shrink-0 rounded-2xl border border-neutral-200 object-cover"
          />
          <div>
            <span
              class="inline-block rounded-full bg-brand-warm px-2.5 py-0.5 text-xs font-bold text-brand-coral"
            >
              {{ product.category }}
            </span>
            <h3 class="mt-1 text-base font-extrabold text-neutral-900 sm:text-lg">
              {{ product.name }}
            </h3>
          </div>
        </div>

        <!-- 規格選擇 -->
        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">選擇規格</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(specItem, index) in product.specs"
              :key="specItem.spec"
              type="button"
              class="cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm font-bold transition"
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

        <!-- 口味／款式選擇 -->
        <div v-if="product.tastes.length > 0">
          <p class="mb-2 text-sm font-bold text-neutral-700">選擇口味／款式</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="taste in product.tastes"
              :key="taste"
              type="button"
              class="cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm font-bold transition"
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

        <!-- 價錢與數量 -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4">
          <div>
            <p class="text-xs font-semibold text-neutral-500">小計</p>
            <p class="text-2xl font-black text-brand-coral">NT${{ totalPrice }}</p>
          </div>

          <div class="inline-flex items-center rounded-full border-2 border-neutral-800 bg-white">
            <button
              type="button"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-full text-neutral-800 transition hover:bg-brand-warm disabled:opacity-40"
              :disabled="quantity <= 1"
              aria-label="減少數量"
              @click="decrement"
            >
              <Minus class="h-4 w-4" />
            </button>
            <span class="min-w-10 text-center text-base font-extrabold">{{ quantity }}</span>
            <button
              type="button"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-full text-neutral-800 transition hover:bg-brand-warm"
              aria-label="增加數量"
              @click="increment"
            >
              <Plus class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-neutral-200 bg-brand-warm/50 px-5 py-4">
        <button
          type="button"
          class="cursor-pointer rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100"
          @click="emit('close')"
        >
          取消
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          @click="handleAddToCart"
        >
          <ShoppingCart class="h-4 w-4" />
          <span>加入購物車</span>
        </button>
      </div>
    </div>
  </div>
</template>
