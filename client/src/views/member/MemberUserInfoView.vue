<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const svgAsset = (filename: string) => `${import.meta.env.BASE_URL}svg/${filename}`

// 編輯模式旗標與儲存／錯誤訊息
const isEditing = ref(false)
const saveMessage = ref('')
const errorMessage = ref('')

const form = ref({
  name: authStore.user?.name ?? '',
  phone: authStore.user?.phone ?? '',
  email: authStore.user?.email ?? '',
})

// 當 authStore.user 異步載入完成且未處於編輯狀態時，同步回填表單
watch(
  () => authStore.user,
  (user) => {
    if (user && !isEditing.value) {
      form.value = {
        name: user.name,
        phone: user.phone,
        email: user.email,
      }
    }
  },
  { immediate: true },
)

function startEdit() {
  saveMessage.value = ''
  errorMessage.value = ''
  isEditing.value = true
}

// 取消編輯並還原為 authStore 中的原始會員資料
function cancelEdit() {
  isEditing.value = false
  errorMessage.value = ''
  if (authStore.user) {
    form.value = {
      name: authStore.user.name,
      phone: authStore.user.phone,
      email: authStore.user.email,
    }
  }
}

function handleSave() {
  errorMessage.value = ''
  if (!form.value.name.trim()) {
    errorMessage.value = '請填寫會員名稱'
    return
  }

  // 後續串接 PATCH /api/member/userinfo 寫入資料庫
  if (authStore.user) {
    authStore.user = {
      ...authStore.user,
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
    }
  }

  isEditing.value = false
  saveMessage.value = '基本資料已更新（本地狀態已同步，待串接後端更新 API）'
}
</script>

<template>
  <div class="max-w-3xl">
    <h1 class="mb-2 text-2xl font-black text-neutral-900">更改基本資料</h1>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div
      v-if="saveMessage"
      class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
    >
      {{ saveMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
    >
      {{ errorMessage }}
    </div>

    <section class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
      <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-lg font-extrabold">
        基本資料
      </div>

      <form class="space-y-5 p-6" @submit.prevent="handleSave">
        <div>
          <label for="profile-name" class="mb-1.5 block text-sm font-bold text-neutral-600">
            名稱
          </label>
          <input
            v-if="isEditing"
            id="profile-name"
            v-model.trim="form.name"
            type="text"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
            required
          />
          <p v-else class="text-base font-bold text-neutral-900">{{ form.name || '-' }}</p>
        </div>

        <div>
          <label for="profile-phone" class="mb-1.5 block text-sm font-bold text-neutral-600">
            手機
          </label>
          <input
            v-if="isEditing"
            id="profile-phone"
            v-model.trim="form.phone"
            type="tel"
            class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
          />
          <p v-else class="text-base font-bold text-neutral-900">{{ form.phone || '尚未填寫' }}</p>
        </div>

        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div class="flex-1">
            <label for="profile-email" class="mb-1.5 block text-sm font-bold text-neutral-600">
              電子郵件
            </label>
            <input
              v-if="isEditing"
              id="profile-email"
              v-model.trim="form.email"
              type="email"
              class="h-11 w-full rounded-xl border-2 border-neutral-800 px-3.5 text-base outline-none focus:border-brand-coral"
              required
            />
            <p v-else class="break-all text-base font-bold text-neutral-900">
              {{ form.email || '-' }}
            </p>
          </div>
          <img :src="svgAsset('shine.svg')" alt="裝飾插圖" class="w-16 self-end sm:w-20" />
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <template v-if="isEditing">
            <button
              type="submit"
              class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
            >
              儲存設定
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-100"
              @click="cancelEdit"
            >
              取消
            </button>
          </template>
          <button
            v-else
            type="button"
            class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-yellow px-6 py-2.5 text-sm font-extrabold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
            @click="startEdit"
          >
            修改
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
