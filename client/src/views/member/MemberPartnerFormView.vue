<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  role: 'nanny' | 'walker'
}>()

const petOptions = ['狗', '貓']
const weekdayOptions = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const sizeOptions = ['1-5公斤', '5-10公斤', '10-15公斤', '15-20公斤']

// 依路由 props.role 動態切換「保姆」或「遛狗者」申請表單標題與欄位
const pageTitle = computed(() =>
  props.role === 'nanny' ? '成為夥伴（保姆 ver.）' : '成為夥伴（遛狗者 ver.）',
)

const isSubmitted = ref(false)
const form = ref({
  introduce: '',
  pets: [] as string[],
  weekdays: [] as string[],
  area: '',
  location: '',
  sizes: [] as string[],
  price: '',
})

// 送出夥伴申請設定
function handleSubmit() {
  // 後續串接 /api/member/become-nanny 或 /api/member/become-walker
  isSubmitted.value = true
}
</script>

<template>
  <div class="max-w-3xl">
    <div class="mb-2 flex items-center justify-between gap-2">
      <h1 class="text-2xl font-black text-neutral-900">{{ pageTitle }}</h1>
      <RouterLink to="/member/join-us" class="text-sm font-bold text-brand-coral hover:underline">
        ← 返回加入我們
      </RouterLink>
    </div>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div
      v-if="isSubmitted"
      class="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
    >
      已儲存您的夥伴申請設定！
    </div>

    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-lg font-extrabold">
        {{ pageTitle }}
      </div>

      <form class="space-y-6 p-6" @submit.prevent="handleSubmit">
        <div v-if="role === 'nanny'">
          <label for="partner-intro" class="mb-1.5 block text-sm font-bold text-neutral-700">
            自我介紹
          </label>
          <textarea
            id="partner-intro"
            v-model.trim="form.introduce"
            rows="3"
            placeholder="可以詳細描述所提供的服務...等"
            class="w-full rounded-2xl border-2 border-neutral-800 p-3.5 text-sm outline-none focus:border-brand-coral sm:text-base"
          ></textarea>
        </div>

        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">可接受寵物</p>
          <div class="flex flex-wrap gap-3">
            <label
              v-for="option in petOptions"
              :key="option"
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm font-semibold"
            >
              <input v-model="form.pets" type="checkbox" :value="option" class="accent-brand-coral" />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">可服務時間</p>
          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="option in weekdayOptions"
              :key="option"
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm font-semibold"
            >
              <input
                v-model="form.weekdays"
                type="checkbox"
                :value="option"
                class="accent-brand-coral"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="partner-area" class="mb-1.5 block text-sm font-bold text-neutral-700">
              可服務地區
            </label>
            <input
              id="partner-area"
              v-model.trim="form.area"
              type="text"
              placeholder="例如 台中市南屯區"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            />
          </div>

          <div v-if="role === 'walker'">
            <label for="partner-location" class="mb-1.5 block text-sm font-bold text-neutral-700">
              所在地區
            </label>
            <input
              id="partner-location"
              v-model.trim="form.location"
              type="text"
              placeholder="例如 台中市西區"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            />
          </div>
        </div>

        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">可接受體型</p>
          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="option in sizeOptions"
              :key="option"
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm font-semibold"
            >
              <input
                v-model="form.sizes"
                type="checkbox"
                :value="option"
                class="accent-brand-coral"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div>
          <label for="partner-price" class="mb-1.5 block text-sm font-bold text-neutral-700">
            服務價格（TWD）
          </label>
          <input
            id="partner-price"
            v-model.trim="form.price"
            type="text"
            placeholder="例如 300"
            class="h-11 w-full max-w-xs rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          />
          <p class="mt-1 text-xs text-neutral-500">平均價格為 TWD 300 / 天</p>
        </div>

        <button
          type="submit"
          class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-8 py-2.5 text-base font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        >
          儲存設定
        </button>
      </form>
    </section>
  </div>
</template>
