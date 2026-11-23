<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageCircle, Star } from 'lucide-vue-next'

interface MissionItem {
  id: number
  date: string
  time: string
  frequency: string
  rating?: number
}

// 後續串接 /api/member/mission 與 /api/member/missionComplete
const upcomingMissions = ref<MissionItem[]>([
  { id: 1, date: '2026-11-26', time: '14:00 - 15:00', frequency: '2 次' },
])

const completedMissions = ref<MissionItem[]>([
  { id: 2, date: '2026-11-12', time: '10:00 - 11:00', frequency: '1 次', rating: 5 },
])
</script>

<template>
  <div class="max-w-4xl space-y-8">
    <div>
      <h1 class="mb-2 text-2xl font-black text-neutral-900">工作管理</h1>
      <div class="h-1 rounded-full bg-brand-coral"></div>
    </div>

    <!-- 即將到來 -->
    <section>
      <h2 class="mb-3 text-lg font-extrabold text-neutral-900">即將到來</h2>
      <div class="overflow-x-auto rounded-3xl border-2 border-neutral-800 bg-white">
        <table class="w-full min-w-[480px] text-left text-sm sm:text-base">
          <thead class="border-b-2 border-neutral-800 bg-brand-yellow text-neutral-900">
            <tr>
              <th class="px-4 py-3 font-extrabold">日期</th>
              <th class="px-4 py-3 font-extrabold">期間</th>
              <th class="px-4 py-3 font-extrabold">次數</th>
              <th class="px-4 py-3 text-center font-extrabold">聯絡飼主</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr v-for="item in upcomingMissions" :key="item.id">
              <td class="px-4 py-3.5 font-semibold">{{ item.date }}</td>
              <td class="px-4 py-3.5">{{ item.time }}</td>
              <td class="px-4 py-3.5">{{ item.frequency }}</td>
              <td class="px-4 py-3.5 text-center">
                <RouterLink
                  to="/member/contact-guest"
                  class="inline-flex items-center justify-center rounded-full p-2 text-neutral-900 transition hover:bg-brand-yellow"
                  aria-label="聯絡飼主"
                >
                  <MessageCircle class="h-6 w-6" />
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 已完成工作 -->
    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-extrabold text-neutral-900">已完成訂單</h2>
        <RouterLink
          to="/member/orderscore"
          class="text-sm font-bold text-brand-coral hover:underline"
        >
          查詢更多 →
        </RouterLink>
      </div>
      <div class="overflow-x-auto rounded-3xl border-2 border-neutral-800 bg-white">
        <table class="w-full min-w-[480px] text-left text-sm sm:text-base">
          <thead class="border-b-2 border-neutral-800 bg-brand-yellow/60 text-neutral-900">
            <tr>
              <th class="px-4 py-3 font-extrabold">日期</th>
              <th class="px-4 py-3 font-extrabold">期間</th>
              <th class="px-4 py-3 font-extrabold">次數</th>
              <th class="px-4 py-3 text-center font-extrabold">評價</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr v-for="item in completedMissions" :key="item.id">
              <td class="px-4 py-3.5 font-semibold">{{ item.date }}</td>
              <td class="px-4 py-3.5">{{ item.time }}</td>
              <td class="px-4 py-3.5">{{ item.frequency }}</td>
              <td class="px-4 py-3.5">
                <div class="flex justify-center gap-1">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    class="h-5 w-5"
                    :class="
                      star <= (item.rating ?? 0)
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
    </section>
  </div>
</template>
