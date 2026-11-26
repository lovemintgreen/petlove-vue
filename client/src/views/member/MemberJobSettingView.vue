<script setup lang="ts">
import { ref } from 'vue'

// 服務選項常數
const petOptions = ['狗', '貓']
const weekdayOptions = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const sizeOptions = ['1-5公斤', '5-10公斤', '10-15公斤', '15-20公斤']

const isEditing = ref(false)
const saveMessage = ref('')

// 後續串接 /api/member/jobsetting 讀寫資料庫
const form = ref({
  introduce: '熱愛毛孩，具備多年照顧貓狗與遛狗經驗。',
  dogCat: ['狗', '貓'] as string[],
  week: ['星期一', '星期三', '星期五', '星期六'] as string[],
  area: '台中市南屯區',
  petSize: ['1-5公斤', '5-10公斤'] as string[],
  price: '300',
})

// 結束編輯模式並顯示儲存提示
function handleSave() {
  isEditing.value = false
  saveMessage.value = '工作設定已儲存！'
}
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="mb-2 text-2xl font-black text-neutral-900">更改工作設定</h1>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div
      v-if="saveMessage"
      class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
    >
      {{ saveMessage }}
    </div>

    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-lg font-extrabold">
        工作設定
      </div>

      <form class="space-y-6 p-6" @submit.prevent="handleSave">
        <div>
          <label for="job-intro" class="mb-1.5 block text-sm font-bold text-neutral-700">
            自我介紹
          </label>
          <textarea
            v-if="isEditing"
            id="job-intro"
            v-model.trim="form.introduce"
            rows="3"
            placeholder="可以詳細描述所提供的服務...等"
            class="w-full rounded-2xl border-2 border-neutral-800 p-3.5 text-sm outline-none focus:border-brand-coral sm:text-base"
          ></textarea>
          <p v-else class="leading-relaxed text-neutral-800">{{ form.introduce || '尚未填寫' }}</p>
        </div>

        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">可接受寵物</p>
          <div class="flex flex-wrap gap-3">
            <label
              v-for="option in petOptions"
              :key="option"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold"
              :class="
                form.dogCat.includes(option)
                  ? 'border-brand-coral bg-brand-yellow/40 text-neutral-900'
                  : 'border-neutral-300 text-neutral-600'
              "
            >
              <input
                v-model="form.dogCat"
                type="checkbox"
                :value="option"
                :disabled="!isEditing"
                class="accent-brand-coral"
              />
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
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold"
              :class="
                form.week.includes(option)
                  ? 'border-brand-coral bg-brand-yellow/40 text-neutral-900'
                  : 'border-neutral-300 text-neutral-600'
              "
            >
              <input
                v-model="form.week"
                type="checkbox"
                :value="option"
                :disabled="!isEditing"
                class="accent-brand-coral"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div>
          <label for="job-area" class="mb-1.5 block text-sm font-bold text-neutral-700">
            可服務地區
          </label>
          <input
            v-if="isEditing"
            id="job-area"
            v-model.trim="form.area"
            type="text"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          />
          <p v-else class="font-semibold text-neutral-800">{{ form.area || '尚未填寫' }}</p>
        </div>

        <div>
          <p class="mb-2 text-sm font-bold text-neutral-700">可接受體型</p>
          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="option in sizeOptions"
              :key="option"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold"
              :class="
                form.petSize.includes(option)
                  ? 'border-brand-coral bg-brand-yellow/40 text-neutral-900'
                  : 'border-neutral-300 text-neutral-600'
              "
            >
              <input
                v-model="form.petSize"
                type="checkbox"
                :value="option"
                :disabled="!isEditing"
                class="accent-brand-coral"
              />
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div>
          <label for="job-price" class="mb-1.5 block text-sm font-bold text-neutral-700">
            服務價格（TWD / 天）
          </label>
          <input
            v-if="isEditing"
            id="job-price"
            v-model.trim="form.price"
            type="text"
            class="h-11 w-full max-w-xs rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          />
          <p v-else class="font-bold text-brand-coral">TWD {{ form.price || '0' }} / 天</p>
          <p class="mt-1 text-xs text-neutral-500">平均價格為 TWD 300 / 天</p>
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <button
            v-if="isEditing"
            type="submit"
            class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
          >
            儲存設定
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="cursor-pointer rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
            @click="isEditing = false"
          >
            取消
          </button>
          <button
            v-else
            type="button"
            class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
            @click="
              () => {
                saveMessage = ''
                isEditing = true
              }
            "
          >
            修改
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
