<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageCircle, Star, X } from 'lucide-vue-next'

interface ServiceRequest {
  id: number
  orderCode: string
  startDate: string
  endDate: string
  location: string
  nannyName: string
  state: string
  rated?: boolean
}

// 後續串接 /api/member/request 與 /api/member/requestComplete
const ongoingRequests = ref<ServiceRequest[]>([
  {
    id: 1,
    orderCode: '#123',
    startDate: '2026-11-25',
    endDate: '2026-11-26',
    location: '台中市南屯區',
    nannyName: '愛遛狗的小姊姊',
    state: '已預約',
  },
])

const completedRequests = ref<ServiceRequest[]>([
  {
    id: 2,
    orderCode: '#118',
    startDate: '2026-11-10',
    endDate: '2026-11-11',
    location: '台中市西區',
    nannyName: '愛遛狗的小姊姊',
    state: '已完成',
    rated: false,
  },
])

// 評分彈窗目標訂單與星等／評論狀態
const ratingTarget = ref<ServiceRequest | null>(null)
const selectedScore = ref(5)
const reviewComment = ref('')
const feedbackMessage = ref('')

function openRatingModal(item: ServiceRequest) {
  ratingTarget.value = item
  selectedScore.value = 5
  reviewComment.value = ''
}

function closeRatingModal() {
  ratingTarget.value = null
}

/**
 * 送出訂單星等評價並將該筆訂單標記為已評分
 */
function submitRating() {
  if (!ratingTarget.value) return
  ratingTarget.value.rated = true
  feedbackMessage.value = `已送出訂單 ${ratingTarget.value.orderCode} 的 ${selectedScore.value} 星評價！`
  closeRatingModal()
}
</script>

<template>
  <div class="max-w-4xl space-y-8">
    <div
      v-if="feedbackMessage"
      class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
    >
      {{ feedbackMessage }}
    </div>

    <!-- 進行中訂單 -->
    <section>
      <h1 class="mb-2 text-2xl font-black text-neutral-900">進行中訂單</h1>
      <div class="mb-5 h-1 rounded-full bg-brand-coral"></div>

      <div class="space-y-4">
        <article
          v-for="item in ongoingRequests"
          :key="item.id"
          class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white"
        >
          <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 font-extrabold">
            訂單編號 {{ item.orderCode }}
          </div>
          <div class="flex flex-col justify-between gap-6 p-5 sm:flex-row sm:items-center">
            <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-x-8 sm:text-base">
              <div>
                <dt class="text-xs font-semibold text-neutral-500">時間</dt>
                <dd class="font-bold text-neutral-900">{{ item.startDate }} 至 {{ item.endDate }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">地點</dt>
                <dd class="font-bold text-neutral-900">{{ item.location }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">接單者</dt>
                <dd class="font-bold text-neutral-900">{{ item.nannyName }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">狀態</dt>
                <dd>
                  <span class="rounded-full bg-brand-coral px-3 py-0.5 text-xs font-bold text-white">
                    {{ item.state }}
                  </span>
                </dd>
              </div>
            </dl>

            <RouterLink
              to="/member/contact-nanny"
              class="inline-flex shrink-0 flex-col items-center gap-1 rounded-2xl border-2 border-neutral-800 bg-brand-warm px-5 py-3 font-bold text-neutral-900 transition hover:bg-brand-yellow"
            >
              <MessageCircle class="h-7 w-7" />
              <span class="text-sm">聯絡保姆</span>
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <!-- 已完成訂單 -->
    <section>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-2xl font-black text-neutral-900">已完成訂單</h2>
        <RouterLink
          to="/member/orderscore"
          class="text-sm font-bold text-brand-coral hover:underline"
        >
          查看全部評價 →
        </RouterLink>
      </div>
      <div class="mb-5 h-1 rounded-full bg-brand-coral"></div>

      <div class="space-y-4">
        <article
          v-for="item in completedRequests"
          :key="item.id"
          class="overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white"
        >
          <div class="border-b-2 border-neutral-800 bg-brand-yellow/60 px-5 py-3 font-extrabold">
            訂單編號 {{ item.orderCode }}
          </div>
          <div class="flex flex-col justify-between gap-6 p-5 sm:flex-row sm:items-center">
            <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-x-8 sm:text-base">
              <div>
                <dt class="text-xs font-semibold text-neutral-500">時間</dt>
                <dd class="font-bold text-neutral-900">{{ item.startDate }} 至 {{ item.endDate }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">地點</dt>
                <dd class="font-bold text-neutral-900">{{ item.location }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">接單者</dt>
                <dd class="font-bold text-neutral-900">{{ item.nannyName }}</dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-neutral-500">狀態</dt>
                <dd class="font-bold text-emerald-700">{{ item.state }}</dd>
              </div>
            </dl>

            <button
              type="button"
              class="shrink-0 cursor-pointer rounded-full border-2 border-neutral-800 px-6 py-2.5 text-sm font-extrabold transition"
              :class="
                item.rated
                  ? 'bg-neutral-100 text-neutral-500'
                  : 'bg-brand-yellow text-neutral-900 hover:bg-brand-coral hover:text-white'
              "
              :disabled="item.rated"
              @click="openRatingModal(item)"
            >
              {{ item.rated ? '已評分' : '評分去' }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- 評分彈窗 -->
    <div
      v-if="ratingTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      @click.self="closeRatingModal"
    >
      <div class="w-full max-w-md overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xl">
        <div class="flex items-center justify-between border-b-2 border-neutral-800 bg-brand-yellow px-5 py-4">
          <h3 class="text-lg font-extrabold text-neutral-900">
            評價訂單 {{ ratingTarget.orderCode }}
          </h3>
          <button
            type="button"
            class="cursor-pointer rounded-full p-1 text-neutral-800 hover:bg-black/10"
            aria-label="關閉視窗"
            @click="closeRatingModal"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <form class="space-y-4 p-5" @submit.prevent="submitRating">
          <div class="rounded-2xl bg-brand-warm p-3.5 text-sm">
            <p><span class="font-bold">接單者：</span>{{ ratingTarget.nannyName }}</p>
            <p><span class="font-bold">時間：</span>{{ ratingTarget.startDate }} 至 {{ ratingTarget.endDate }}</p>
            <p><span class="font-bold">地點：</span>{{ ratingTarget.location }}</p>
          </div>

          <div class="text-center">
            <p class="mb-2 text-sm font-bold text-neutral-700">點擊星星評分</p>
            <div class="flex justify-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="cursor-pointer transition hover:scale-110"
                :aria-label="`評分 ${star} 顆星`"
                @click="selectedScore = star"
              >
                <Star
                  class="h-8 w-8"
                  :class="
                    star <= selectedScore
                      ? 'fill-brand-yellow text-brand-yellow'
                      : 'text-neutral-300'
                  "
                />
              </button>
            </div>
          </div>

          <div>
            <label for="review-comment" class="mb-1.5 block text-sm font-bold text-neutral-700">
              留言
            </label>
            <textarea
              id="review-comment"
              v-model.trim="reviewComment"
              rows="3"
              required
              placeholder="分享這次服務的體驗..."
              class="w-full rounded-2xl border-2 border-neutral-800 p-3 text-sm outline-none focus:border-brand-coral"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="cursor-pointer rounded-full border border-neutral-300 px-5 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
              @click="closeRatingModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="cursor-pointer rounded-full border-2 border-neutral-800 bg-brand-coral px-6 py-2 text-sm font-bold text-white transition hover:opacity-90"
            >
              發表評論
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
