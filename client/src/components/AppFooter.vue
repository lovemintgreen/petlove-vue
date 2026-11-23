<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface FooterLinkItem {
  label: string
  to: string
}

const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const serviceLinks: FooterLinkItem[] = [
  { label: '寵物代遛', to: '/walking' },
  { label: '寵物保母', to: '/nanny' },
  { label: '毛孩領養', to: '/adopt' },
]

const shopLinks: FooterLinkItem[] = [
  { label: '乾飼料', to: '/shop' },
  { label: '罐頭', to: '/shop' },
  { label: '零食', to: '/shop' },
  { label: '其他用品', to: '/shop' },
]

const contactItems = ['04-2326-5860', '10:00 - 22:00', 'petlove@gmail.com']
</script>

<template>
  <footer class="row mx-0">
    <div class="col-12 d-flex justify-content-center align-items-center footerLogoBox">
      <RouterLink to="/" class="d-flex justify-content-center">
        <img :src="asset('LOGO.png')" alt="PetLove Logo" />
      </RouterLink>
    </div>

    <div class="col-12 row">
      <div class="col row box">
        <ul class="d-grid">
          <li class="col mb-auto user-select-none">服務項目</li>
          <li v-for="item in serviceLinks" :key="item.to" class="col mb-auto">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <div class="col row box">
        <ul class="d-grid">
          <li class="col mb-auto user-select-none">商品一覽</li>
          <li v-for="item in shopLinks" :key="item.label" class="col mb-auto">
            <RouterLink :to="item.to">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <div class="col row box user-select-none">
        <ul class="d-grid">
          <li class="col mb-auto">聯絡我們</li>
          <li v-for="text in contactItems" :key="text" class="col mb-auto">
            <p class="mb-0">{{ text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  margin-top: 500px;
  background-color: #ffcb48;
  border-radius: 100px 100px 0 0;
  width: 100%;
  height: 1100px;

  ul {
    list-style-type: none;
    width: 200px;
    height: 300px;
    text-align: center;
    white-space: nowrap;
  }

  ul a {
    text-decoration: none;
    color: black;
  }

  ul li:first-child {
    font-size: 20px;
    font-weight: 900;
  }

  .footerLogoBox {
    height: 50%;

    img {
      width: 50%;
    }
  }
}
</style>
