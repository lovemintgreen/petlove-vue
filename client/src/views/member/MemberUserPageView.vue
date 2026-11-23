<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const activeTab = ref<'profile' | 'work'>('profile')

// 後續串接 /api/member/jobsetting 取得真實工作設定
const jobSetting = ref({
  introduce: '熱愛毛孩，具備多年照顧貓狗與遛狗經驗，細心耐心，隨時回報毛孩狀況。',
  dogCat: '狗、貓',
  week: '星期一、星期三、星期五、星期六',
  area: '台中市南屯區',
  petSize: '1-5公斤、5-10公斤',
  price: 'TWD 300 / 天',
})

const galleryPhotos = [
  { src: imgAsset('girl with dog.jpg'), alt: '服務照片 1' },
  { src: imgAsset('lookupcat.jpg'), alt: '服務照片 2' },
  { src: imgAsset('terms.jpg'), alt: '服務照片 3' },
]
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="mb-5 text-2xl font-black text-neutral-900">個人檔案</h1>

    <!-- Tabs -->
    <div class="mb-6 flex gap-2 border-b-2 border-neutral-200" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'profile'"
        class="cursor-pointer rounded-t-2xl px-5 py-2.5 text-base font-bold transition"
        :class="
          activeTab === 'profile'
            ? 'border-2 border-b-0 border-neutral-800 bg-brand-yellow text-neutral-900'
            : 'text-neutral-500 hover:text-brand-coral'
        "
        @click="activeTab = 'profile'"
      >
        基本資料
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'work'"
        class="cursor-pointer rounded-t-2xl px-5 py-2.5 text-base font-bold transition"
        :class="
          activeTab === 'work'
            ? 'border-2 border-b-0 border-neutral-800 bg-brand-yellow text-neutral-900'
            : 'text-neutral-500 hover:text-brand-coral'
        "
        @click="activeTab = 'work'"
      >
        工作設定
      </button>
    </div>

    <!-- 基本資料分頁 -->
    <section
      v-if="activeTab === 'profile'"
      class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white"
    >
      <dl class="divide-y divide-neutral-200">
        <div class="grid grid-cols-1 sm:grid-cols-4">
          <dt class="bg-brand-yellow/80 px-5 py-3.5 font-bold text-neutral-900 sm:text-center">
            姓名
          </dt>
          <dd class="px-5 py-3.5 font-semibold text-neutral-800 sm:col-span-3">
            {{ authStore.user?.name || '-' }}
          </dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4">
          <dt class="bg-brand-yellow/80 px-5 py-3.5 font-bold text-neutral-900 sm:text-center">
            電話
          </dt>
          <dd class="px-5 py-3.5 font-semibold text-neutral-800 sm:col-span-3">
            {{ authStore.user?.phone || '尚未填寫' }}
          </dd>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4">
          <dt class="bg-brand-yellow/80 px-5 py-3.5 font-bold text-neutral-900 sm:text-center">
            Email
          </dt>
          <dd class="break-all px-5 py-3.5 font-semibold text-neutral-800 sm:col-span-3">
            {{ authStore.user?.email || '-' }}
          </dd>
        </div>
      </dl>

      <div class="flex justify-end border-t border-neutral-200 bg-brand-warm/50 px-5 py-3.5">
        <RouterLink
          to="/member/userinfo"
          class="rounded-full border-2 border-neutral-800 bg-brand-yellow px-5 py-2 text-sm font-bold text-neutral-900 transition hover:bg-brand-coral hover:text-white"
        >
          前往編輯基本資料
        </RouterLink>
      </div>
    </section>

    <!-- 工作設定分頁 -->
    <section v-else class="space-y-6">
      <div class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white">
        <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 font-extrabold">
          自我介紹
        </div>
        <p class="p-5 leading-relaxed text-neutral-700">{{ jobSetting.introduce }}</p>
      </div>

      <div class="overflow-x-auto rounded-3xl border-2 border-neutral-800 bg-white">
        <table class="w-full min-w-[600px] text-left text-sm">
          <thead class="border-b-2 border-neutral-800 bg-brand-yellow text-neutral-900">
            <tr>
              <th class="px-4 py-3 font-extrabold">可接受寵物</th>
              <th class="px-4 py-3 font-extrabold">可服務時間</th>
              <th class="px-4 py-3 font-extrabold">可服務地區</th>
              <th class="px-4 py-3 font-extrabold">可接受體型</th>
              <th class="px-4 py-3 font-extrabold">價格</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-neutral-800">
              <td class="px-4 py-4 font-semibold">{{ jobSetting.dogCat }}</td>
              <td class="px-4 py-4">{{ jobSetting.week }}</td>
              <td class="px-4 py-4">{{ jobSetting.area }}</td>
              <td class="px-4 py-4">{{ jobSetting.petSize }}</td>
              <td class="px-4 py-4 font-bold text-brand-coral">{{ jobSetting.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-extrabold text-neutral-900">照片專區</h2>
          <RouterLink
            to="/member/jobsetting"
            class="text-sm font-bold text-brand-coral hover:underline"
          >
            編輯工作設定 →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <img
            v-for="photo in galleryPhotos"
            :key="photo.src"
            :src="photo.src"
            :alt="photo.alt"
            class="h-48 w-full rounded-2xl border border-neutral-200 object-cover"
          />
        </div>
      </div>
    </section>
  </div>
</template>
