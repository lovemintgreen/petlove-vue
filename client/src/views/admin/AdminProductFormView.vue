<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowLeft, ImagePlus, Plus, Trash2 } from 'lucide-vue-next'
import { createProductApi, getProductByIdApi, updateProductApi } from '@/api/products'
import { resolveProductImage } from '@/utils/image'

// 單筆商品規格表單列（localId 供 v-for key 使用；price 容許 Vue number input 自動轉型）
interface SpecFormRow {
  localId: number
  spec: string
  taste: string
  price: string | number
}

const route = useRoute()
const router = useRouter()

// 預設商品分類快速選填清單與圖片大小上限（5MB）
const DEFAULT_CATEGORIES = ['乾飼料', '罐頭', '零食', '其他用品']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

// 由路由參數判斷目前為「編輯模式」或「新增模式」
const editProductId = computed(() => {
  const param = route.params.id
  if (typeof param !== 'string' || !/^\d+$/.test(param)) return null
  return Number(param)
})

const isEditMode = computed(() => editProductId.value !== null)

// 表單欄位狀態
const name = ref('')
const category = ref('乾飼料')
const stock = ref<string | number>('0')
const introduction = ref('')
const specs = ref<SpecFormRow[]>([{ localId: 1, spec: '', taste: '', price: '' }])

// 圖片狀態：既有圖片路徑、使用者新選檔案與本地預覽 ObjectURL
const existingImage = ref('')
const selectedFile = ref<File | null>(null)
const previewObjectUrl = ref('')

const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

let nextSpecLocalId = 2

// 優先顯示新選擇圖片的預覽網址，否則回退顯示既有商品圖片
const displayPreviewUrl = computed(() => {
  if (previewObjectUrl.value) return previewObjectUrl.value
  return existingImage.value ? resolveProductImage(existingImage.value) : ''
})

// 釋放瀏覽器建立的暫存預覽 URL，避免記憶體洩漏
function revokePreviewUrl() {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = ''
  }
}

/**
 * 重設表單為新增商品的初始狀態
 */
function resetForm() {
  revokePreviewUrl()
  name.value = ''
  category.value = '乾飼料'
  stock.value = '0'
  introduction.value = ''
  existingImage.value = ''
  selectedFile.value = null
  errorMessage.value = ''
  specs.value = [{ localId: nextSpecLocalId++, spec: '', taste: '', price: '' }]
}

/**
 * 編輯模式載入既有商品資料與規格回填表單
 */
async function loadProductForEdit(productId: number) {
  isLoading.value = true
  errorMessage.value = ''
  revokePreviewUrl()
  selectedFile.value = null

  try {
    const product = await getProductByIdApi(productId)
    name.value = product.name
    category.value = product.category
    stock.value = String(product.stock)
    introduction.value = product.introduction
    existingImage.value = product.image
    specs.value =
      product.specs.length > 0
        ? product.specs.map((item) => ({
            localId: nextSpecLocalId++,
            spec: item.spec,
            taste: item.taste ?? '',
            price: String(item.price),
          }))
        : [{ localId: nextSpecLocalId++, spec: '', taste: '', price: '' }]
  } catch (err) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      errorMessage.value = err.response?.data?.message || '無法載入商品資料'
    } else {
      errorMessage.value = '無法載入商品資料'
    }
  } finally {
    isLoading.value = false
  }
}

// 監聽路由 id 變化，支援在新增／編輯頁面間切換時自動重載或清空表單
watch(
  editProductId,
  (id) => {
    if (id !== null) {
      loadProductForEdit(id)
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  revokePreviewUrl()
})

function addSpecRow() {
  specs.value.push({ localId: nextSpecLocalId++, spec: '', taste: '', price: '' })
}

// 至少保留一組商品規格，避免送出空規格列表
function removeSpecRow(localId: number) {
  if (specs.value.length <= 1) return
  specs.value = specs.value.filter((row) => row.localId !== localId)
}

/**
 * 處理圖片選取並驗證檔案格式與大小（<= 5MB）
 */
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  errorMessage.value = ''

  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    errorMessage.value = '僅支援 JPG、PNG、WebP、GIF 圖片格式'
    input.value = ''
    return
  }

  if (file.size > MAX_IMAGE_BYTES) {
    errorMessage.value = '圖片檔案不可超過 5MB'
    input.value = ''
    return
  }

  revokePreviewUrl()
  selectedFile.value = file
  previewObjectUrl.value = URL.createObjectURL(file)
}

/**
 * 驗證基本欄位與多組規格後，以 FormData 呼叫新增或更新商品 API
 */
async function handleSubmit() {
  errorMessage.value = ''

  const trimmedName = name.value.trim()
  const trimmedCategory = category.value.trim()
  // 使用 String() 轉字串再 trim()，避免 <input type="number"> 回傳數值型別時出錯
  const rawStock = String(stock.value ?? '').trim()
  const parsedStock = Number(rawStock)

  if (!trimmedName) {
    errorMessage.value = '請填寫商品名稱'
    return
  }
  if (!trimmedCategory) {
    errorMessage.value = '請填寫商品分類'
    return
  }
  if (rawStock === '' || !Number.isInteger(parsedStock) || parsedStock < 0) {
    errorMessage.value = '庫存數量必須為 0 以上的整數'
    return
  }
  if (!isEditMode.value && !selectedFile.value) {
    errorMessage.value = '請上傳商品圖片'
    return
  }

  const normalizedSpecs: { spec: string; taste: string; price: number }[] = []
  for (const row of specs.value) {
    const spec = row.spec.trim()
    const taste = row.taste.trim()
    const rawPrice = String(row.price ?? '').trim()
    const price = Number(rawPrice)

    if (!spec) {
      errorMessage.value = '每組規格名稱皆為必填'
      return
    }
    if (rawPrice === '' || !Number.isInteger(price) || price < 0) {
      errorMessage.value = '每組價格必須為 0 以上的整數'
      return
    }

    normalizedSpecs.push({ spec, taste, price })
  }

  // 組裝 multipart/form-data，規格陣列序列化為 JSON 字串供後端 Transaction 寫入
  const formData = new FormData()
  formData.append('name', trimmedName)
  formData.append('category', trimmedCategory)
  formData.append('stock', String(parsedStock))
  formData.append('introduction', introduction.value.trim())
  formData.append('specs', JSON.stringify(normalizedSpecs))

  if (selectedFile.value) {
    formData.append('productImg', selectedFile.value)
  }

  isSubmitting.value = true
  try {
    if (isEditMode.value && editProductId.value !== null) {
      await updateProductApi(editProductId.value, formData)
      await router.push({
        name: 'admin-products',
        query: { notice: `已更新商品「${trimmedName}」` },
      })
    } else {
      await createProductApi(formData)
      await router.push({
        name: 'admin-products',
        query: { notice: `已上架新商品「${trimmedName}」` },
      })
    }
  } catch (err) {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      errorMessage.value = err.response?.data?.message || '儲存失敗，請稍後再試'
    } else {
      errorMessage.value = '儲存失敗，請稍後再試'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <RouterLink
        :to="{ name: 'admin-products' }"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 transition hover:text-brand-coral"
      >
        <ArrowLeft class="h-4 w-4" />
        <span>返回商品列表</span>
      </RouterLink>
      <h1 class="mt-2 text-2xl font-black text-neutral-900">
        {{ isEditMode ? '編輯商品' : '上架新商品' }}
      </h1>
    </div>

    <div v-if="isLoading" class="h-96 animate-pulse rounded-3xl border-2 border-neutral-200 bg-white"></div>

    <form
      v-else
      class="space-y-6 rounded-3xl border-2 border-neutral-800 bg-white p-6 sm:p-8"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <div
        v-if="errorMessage"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <!-- 基本資訊 -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="prod-name" class="mb-1.5 block text-sm font-bold text-neutral-700">
            商品名稱 *
          </label>
          <input
            id="prod-name"
            v-model="name"
            type="text"
            maxlength="150"
            placeholder="例如 貓用｜無穀低敏田園雞肉成貓糧"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
        </div>

        <div>
          <label for="prod-category" class="mb-1.5 block text-sm font-bold text-neutral-700">
            商品分類 *
          </label>
          <input
            id="prod-category"
            v-model="category"
            type="text"
            maxlength="50"
            placeholder="選擇或輸入分類"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button
              v-for="cat in DEFAULT_CATEGORIES"
              :key="cat"
              type="button"
              class="cursor-pointer rounded-full border px-3 py-0.5 text-xs font-bold transition"
              :class="
                category === cat
                  ? 'border-neutral-900 bg-brand-yellow text-neutral-900'
                  : 'border-neutral-300 bg-white text-neutral-600 hover:border-brand-coral'
              "
              @click="category = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div>
          <label for="prod-stock" class="mb-1.5 block text-sm font-bold text-neutral-700">
            庫存數量 *
          </label>
          <input
            id="prod-stock"
            v-model="stock"
            type="number"
            min="0"
            step="1"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
        </div>
      </div>

      <!-- 商品圖片上傳 -->
      <div>
        <p class="mb-1.5 text-sm font-bold text-neutral-700">
          商品圖片 {{ isEditMode ? '（未選擇則保留原圖）' : '*' }}
        </p>

        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div
            class="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-400 bg-brand-warm p-2"
          >
            <img
              v-if="displayPreviewUrl"
              :src="displayPreviewUrl"
              alt="商品預覽圖"
              class="h-full w-full rounded-xl object-contain"
            />
            <div v-else class="text-center text-xs text-neutral-400">
              <ImagePlus class="mx-auto mb-1 h-7 w-7" />
              <span>尚未選擇圖片</span>
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-2 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
            >
              <ImagePlus class="h-4 w-4" />
              <span>{{ displayPreviewUrl ? '更換圖片' : '選擇圖片檔案' }}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="sr-only"
                @change="handleFileChange"
              />
            </label>
            <p class="text-xs text-neutral-500">
              支援 JPG、PNG、WebP、GIF，檔案大小上限 5MB
            </p>
            <p v-if="selectedFile" class="text-xs font-semibold text-emerald-700">
              已選取：{{ selectedFile.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- 動態規格與價格列表 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-bold text-neutral-700">商品規格、口味與價格 *</p>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-full border-2 border-neutral-800 bg-white px-3.5 py-1 text-xs font-extrabold text-neutral-900 transition hover:bg-brand-yellow"
            @click="addSpecRow"
          >
            <Plus class="h-3.5 w-3.5" />
            <span>新增規格</span>
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(row, index) in specs"
            :key="row.localId"
            class="grid grid-cols-1 gap-3 rounded-2xl border border-neutral-200 bg-brand-warm/50 p-3.5 sm:grid-cols-12 sm:items-end"
          >
            <div class="sm:col-span-4">
              <label :for="`spec-${row.localId}`" class="mb-1 block text-xs font-bold text-neutral-600">
                規格 #{{ index + 1 }} *
              </label>
              <input
                :id="`spec-${row.localId}`"
                v-model="row.spec"
                type="text"
                placeholder="例如 1.5kg、80g 單罐"
                class="h-10 w-full rounded-xl border-2 border-neutral-800 bg-white px-3 text-sm outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div class="sm:col-span-4">
              <label :for="`taste-${row.localId}`" class="mb-1 block text-xs font-bold text-neutral-600">
                口味／款式
              </label>
              <input
                :id="`taste-${row.localId}`"
                v-model="row.taste"
                type="text"
                placeholder="例如 田園雞肉（選填）"
                class="h-10 w-full rounded-xl border-2 border-neutral-800 bg-white px-3 text-sm outline-none focus:border-brand-coral"
              />
            </div>

            <div class="sm:col-span-3">
              <label :for="`price-${row.localId}`" class="mb-1 block text-xs font-bold text-neutral-600">
                單價（TWD）*
              </label>
              <input
                :id="`price-${row.localId}`"
                v-model="row.price"
                type="number"
                min="0"
                step="1"
                placeholder="680"
                class="h-10 w-full rounded-xl border-2 border-neutral-800 bg-white px-3 text-sm outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div class="flex justify-end sm:col-span-1">
              <button
                type="button"
                class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"
                :disabled="specs.length <= 1"
                aria-label="移除此規格"
                @click="removeSpecRow(row.localId)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品介紹 -->
      <div>
        <label for="prod-intro" class="mb-1.5 block text-sm font-bold text-neutral-700">
          商品介紹
        </label>
        <textarea
          id="prod-intro"
          v-model="introduction"
          rows="4"
          placeholder="輸入商品成分、適用對象、特色說明..."
          class="w-full rounded-2xl border-2 border-neutral-800 p-3.5 text-sm outline-none focus:border-brand-coral sm:text-base"
        ></textarea>
      </div>

      <!-- 送出按鈕 -->
      <div class="flex flex-wrap justify-end gap-3 border-t border-neutral-200 pt-5">
        <RouterLink
          :to="{ name: 'admin-products' }"
          class="inline-flex h-12 items-center rounded-full border border-neutral-300 px-6 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100"
        >
          取消
        </RouterLink>
        <button
          type="submit"
          class="h-12 cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-coral px-8 text-base font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '儲存中...' : isEditMode ? '儲存變更' : '確認上架' }}
        </button>
      </div>
    </form>
  </div>
</template>
