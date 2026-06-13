<template>
  <div class="min-h-screen gradient-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎙️</div>
        <h1 class="text-3xl font-bold text-amber-800">MandarinGame</h1>
        <p class="text-amber-700 mt-2">母语纠音训练游戏</p>
      </div>

      <!-- 表单卡片 -->
      <div class="card">
        <n-tabs v-model:value="activeTab" type="line" animated>
          <n-tab-pane name="login" tab="登录">
            <form @submit.prevent="handleLogin" class="space-y-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  class="input-field"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  class="input-field"
                  placeholder="请输入密码"
                  required
                />
              </div>
              <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
              <button type="submit" class="btn-primary w-full" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
              </button>
              <div class="text-center text-sm text-gray-500 mt-2">
                演示账号：demo@mandarin.game / demo123456
              </div>
            </form>
          </n-tab-pane>

          <n-tab-pane name="register" tab="注册">
            <form @submit.prevent="handleRegister" class="space-y-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  class="input-field"
                  placeholder="请输入用户名（3-20字符）"
                  required
                  minlength="3"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  class="input-field"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  class="input-field"
                  placeholder="请输入密码（至少6位）"
                  required
                  minlength="6"
                />
              </div>
              <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
              <button type="submit" class="btn-primary w-full" :disabled="loading">
                {{ loading ? '注册中...' : '注册' }}
              </button>
            </form>
          </n-tab-pane>
        </n-tabs>
      </div>

      <p class="text-center text-amber-700 text-sm mt-6">
        使用 Web Speech API 进行实时发音评测 🎤
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NTabs, NTabPane } from 'naive-ui'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref('login')
const loading = ref(false)
const error = ref('')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ username: '', email: '', password: '' })

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(loginForm.value.email, loginForm.value.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(registerForm.value.username, registerForm.value.email, registerForm.value.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
