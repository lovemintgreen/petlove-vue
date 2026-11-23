import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getMeApi, loginApi, registerApi } from '@/api/auth'
import { TOKEN_STORAGE_KEY } from '@/api/request'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
  const user = ref<User | null>(null)
  const initialized = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value && user.value))

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    initialized.value = true
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  async function register(payload: RegisterPayload) {
    const data = await registerApi(payload)
    setAuth(data.token, data.user)
    return data.user
  }

  async function login(payload: LoginPayload) {
    const data = await loginApi(payload)
    setAuth(data.token, data.user)
    return data.user
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null
      initialized.value = true
      return null
    }

    try {
      const data = await getMeApi()
      user.value = data.user
      return data.user
    } catch {
      clearAuth()
      return null
    } finally {
      initialized.value = true
    }
  }

  function logout() {
    clearAuth()
    initialized.value = true
  }

  return {
    token,
    user,
    initialized,
    isLoggedIn,
    setAuth,
    clearAuth,
    register,
    login,
    fetchMe,
    logout,
  }
})
