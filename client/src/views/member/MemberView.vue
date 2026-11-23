<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const imgAsset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const marqueeText =
  '您的帳號控制台裡，您可以檢視近期的訂單，管理您的收貨地址，您可以更改密碼或修改帳號資料。 '.repeat(
    4,
  )
</script>

<template>
  <div>
    <!-- 跑馬燈提示 -->
    <div
      class="mb-6 w-full overflow-hidden rounded-2xl border-2 border-dashed border-brand-coral bg-[#fff3d1] py-2.5 whitespace-nowrap"
    >
      <p class="member-marquee inline-block text-sm font-bold text-brand-coral sm:text-base">
        {{ marqueeText }}
      </p>
    </div>

    <!-- 會員基本資料卡 -->
    <section
      v-if="authStore.user"
      class="mb-10 overflow-hidden rounded-3xl border-2 border-neutral-800 bg-white shadow-xs"
    >
      <div class="border-b-2 border-neutral-800 bg-brand-yellow px-5 py-3 text-lg font-extrabold">
        基本資料
      </div>
      <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <p class="mb-1 text-sm text-neutral-500">會員名稱</p>
          <p class="text-base font-bold text-neutral-900">{{ authStore.user.name }}</p>
        </div>
        <div>
          <p class="mb-1 text-sm text-neutral-500">電子郵件</p>
          <p class="break-all text-base font-bold text-neutral-900">
            {{ authStore.user.email }}
          </p>
        </div>
        <div>
          <p class="mb-1 text-sm text-neutral-500">手機號碼</p>
          <p class="text-base font-bold text-neutral-900">
            {{ authStore.user.phone || '尚未填寫' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Logo 視覺區 -->
    <div class="flex justify-center py-8 sm:py-12">
      <img
        :src="imgAsset('LOGO.png')"
        alt="PetLove Logo"
        class="w-56 max-w-[75%] opacity-90 sm:w-80"
      />
    </div>
  </div>
</template>

<style scoped>
.member-marquee {
  animation: marquee-left 32s linear infinite;
}
</style>
