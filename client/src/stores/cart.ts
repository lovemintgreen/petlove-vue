import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem } from '@/types/shop'

const CART_STORAGE_KEY = 'petlove_cart_items'
const FREE_SHIPPING_THRESHOLD = 1000
const DEFAULT_SHIPPING_FEE = 60
const DISCOUNT_RATE = 0.88

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).key === 'string' &&
        typeof (item as CartItem).productId === 'number' &&
        typeof (item as CartItem).unitPrice === 'number' &&
        typeof (item as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadStoredCart())

  watch(
    items,
    (val) => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  )

  const discountedSubtotal = computed(() => Math.floor(subtotal.value * DISCOUNT_RATE))

  const discountAmount = computed(() => subtotal.value - discountedSubtotal.value)

  const shippingFee = computed(() => {
    if (subtotal.value === 0) return 0
    return subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE
  })

  const freeShippingGap = computed(() => {
    if (subtotal.value === 0 || subtotal.value >= FREE_SHIPPING_THRESHOLD) return 0
    return FREE_SHIPPING_THRESHOLD - subtotal.value
  })

  const finalTotal = computed(() => discountedSubtotal.value + shippingFee.value)

  function addItem(payload: Omit<CartItem, 'key'>) {
    const key = `${payload.productId}__${payload.productSpec}__${payload.taste}`
    const existing = items.value.find((item) => item.key === key)

    if (existing) {
      existing.quantity += payload.quantity
    } else {
      items.value.push({
        ...payload,
        key,
      })
    }
  }

  function increment(key: string) {
    const target = items.value.find((item) => item.key === key)
    if (target) {
      target.quantity += 1
    }
  }

  function decrement(key: string) {
    const target = items.value.find((item) => item.key === key)
    if (!target) return
    if (target.quantity > 1) {
      target.quantity -= 1
    } else {
      removeItem(key)
    }
  }

  function removeItem(key: string) {
    items.value = items.value.filter((item) => item.key !== key)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalCount,
    subtotal,
    discountedSubtotal,
    discountAmount,
    shippingFee,
    freeShippingGap,
    finalTotal,
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
  }
})
