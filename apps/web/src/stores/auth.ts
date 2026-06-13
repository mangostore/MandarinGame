import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function register(username: string, email: string, password: string) {
    const res: any = await authApi.register({ username, email, password })
    token.value = res.access_token
    user.value = res.user
    localStorage.setItem('token', res.access_token)
    return res
  }

  async function login(email: string, password: string) {
    const res: any = await authApi.login({ email, password })
    token.value = res.access_token
    user.value = res.user
    localStorage.setItem('token', res.access_token)
    return res
  }

  async function fetchProfile() {
    try {
      const res: any = await authApi.getProfile()
      user.value = res
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  if (token.value) fetchProfile()

  return { token, user, isLoggedIn, register, login, fetchProfile, logout }
})
