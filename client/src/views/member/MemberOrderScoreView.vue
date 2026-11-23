<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

interface OrderScoreItem {
  id: number
  guestName: string
  date: string
  period: string
  times: number
  score: number | null
}

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const scores = ref<OrderScoreItem[]>([
  { id: 1, guestName: '王小明', date: '2026-11-18', period: '13:00', times: 2, score: null },
  { id: 2, guestName: '林小美', date: '2026-11-12', period: '10:00', times: 1, score: 5 },
])
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <h1 class="mb-2 text-2xl font-black text-neutral-900">訂單評價紀錄</h1>
      <div class="h-1 rounded-full bg-brand-coral"></div>
    </div>

    <div class="space-y-5">
      <article
        v-for="item in scores"
        :key="item.id"
        class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white"
      >
        <div class="flex items-center gap-3.5 border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3.5">
          <img
            :src="imgAsset('girl with dog.jpg')"
            :alt="item.guestName"
            class="h-12 w-12 rounded-full border-2 border-white object-cover"
          />
          <span class="text-base font-extrabold text-neutral-900">{{ item.guestName }}</span>
        </div>

        <div class="overflow-x-auto p-5">
          <table class="w-full min-w-[420px] text-left text-sm sm:text-base">
            <thead>
              <tr class="border-b border-neutral-200 text-neutral-500">
                <th class="pb-2.5 font-bold">日期</th>
                <th class="pb-2.5 font-bold">期間</th>
                <th class="pb-2.5 font-bold">次數</th>
                <th class="pb-2.5 text-center font-bold">評價</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="pt-3 font-semibold text-neutral-900">{{ item.date }}</td>
                <td class="pt-3 text-neutral-800">{{ item.period }}</td>
                <td class="pt-3 text-neutral-800">{{ item.times }}</td>
                <td class="pt-3 text-center">
                  <span v-if="item.score === null" class="text-sm text-neutral-400">尚未評分</span>
                  <div v-else class="flex justify-center gap-1">
                    <Star
                      v-for="star in 5"
                      :key="star"
                      class="h-5 w-5"
                      :class="
                        star <= item.score
                          ? 'fill-brand-yellow text-brand-yellow'
                          : 'text-neutral-300'
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </div>
</template>
