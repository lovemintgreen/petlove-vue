<script setup lang="ts">
import { ref } from 'vue'

interface AdoptionPet {
  id: number
  petName: string
  petGender: string
  status: string
  avatar: string
}

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

// 後續串接 /api/member/adoption 取得真實領養資料
const pets = ref<AdoptionPet[]>([
  {
    id: 1,
    petName: '橘子',
    petGender: '女生',
    status: '開放領養中',
    avatar: imgAsset('大頭照.png'),
  },
])
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="mb-2 text-2xl font-black text-neutral-900">領養寶貝</h1>
    <div class="mb-6 h-1 rounded-full bg-brand-coral"></div>

    <div
      v-if="pets.length === 0"
      class="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500"
    >
      目前尚無領養管理資料
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="pet in pets"
        :key="pet.id"
        class="flex flex-col items-center justify-between gap-4 rounded-3xl border-2 border-neutral-800 bg-white p-5 sm:flex-row"
      >
        <div class="flex items-center gap-4">
          <img
            :src="pet.avatar"
            :alt="pet.petName"
            class="h-16 w-16 rounded-full border-2 border-brand-yellow object-cover"
          />
          <div>
            <p class="text-lg font-extrabold text-neutral-900">{{ pet.petName }}</p>
            <p class="text-sm text-neutral-500">性別：{{ pet.petGender }}</p>
          </div>
        </div>

        <span class="rounded-full bg-brand-yellow px-4 py-1.5 text-sm font-extrabold text-neutral-900">
          {{ pet.status }}
        </span>
      </article>
    </div>
  </div>
</template>
