<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

interface NavLinkItem {
  label: string
  to: string
}

const asset = (filename: string) => `${import.meta.env.BASE_URL}img/${filename}`

const serviceLinks: NavLinkItem[] = [
  { label: '代遛服務', to: '/walking' },
  { label: '寵物保母', to: '/nanny' },
  { label: '毛孩領養', to: '/adopt' },
]

const isServiceMenuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleServiceMenu() {
  isServiceMenuOpen.value = !isServiceMenuOpen.value
}

function closeServiceMenu() {
  isServiceMenuOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeServiceMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid row">
      <div class="col-3">
        <RouterLink class="navbar-brand" to="/">
          <img :src="asset('logo白.png')" alt="PetLove Logo" class="logoImg" />
        </RouterLink>
      </div>

      <div class="col-9 d-flex justify-content-center" id="navbarSupportedContent">
        <div class="col-10">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center">
            <li ref="dropdownRef" class="nav-item dropdown mx-3">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                :aria-expanded="isServiceMenuOpen"
                @click.prevent="toggleServiceMenu"
              >
                服務項目
              </a>
              <ul class="dropdown-menu" :class="{ show: isServiceMenuOpen }">
                <li v-for="item in serviceLinks" :key="item.to">
                  <RouterLink
                    class="dropdown-item fs-5"
                    :to="item.to"
                    @click="closeServiceMenu"
                  >
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </li>

            <li class="nav-item mx-3">
              <RouterLink class="nav-link" to="/shop">商品一覽</RouterLink>
            </li>

            <li class="nav-item mx-3">
              <RouterLink class="nav-link" to="/faq">FAQ</RouterLink>
            </li>
          </ul>
        </div>

        <ul class="navbar-nav d-flex flex-row flex-nowrap col-6 align-items-center">
          <li class="nav-item mx-4 text-center">
            <RouterLink to="/member">
              <img :src="asset('membercat.png')" alt="會員中心" class="member-icon" />
            </RouterLink>
          </li>
          <li class="nav-item mx-4 text-center">
            <RouterLink to="/shop/cart">
              <img :src="asset('cart.png')" alt="購物車" class="cart-icon" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  background-color: #ff6144;
  height: 80px;
  font-size: 18px;

  li {
    list-style: none;
  }

  .logoImg {
    width: 150px;
    padding-left: 50px;
  }
}

.dropdown-menu {
  border: 3px solid black;
  width: fit-content;

  .dropdown-item:hover {
    background-color: #ffcb48;
  }
}

.nav-link {
  background-color: white;
  border: 2px solid black;
  border-radius: 30px;
  white-space: nowrap;
  width: 120px;
  height: 55px;
  text-align: center;
  padding-top: 10px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: #ffcb48;
  border-color: #ffffff;
}

.nav-link:active {
  color: #ff4f30;
}

.member-icon {
  height: 55px;
}

.cart-icon {
  height: 50px;
}
</style>
