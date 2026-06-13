<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🎙️</span>
          <span class="font-bold text-amber-700 text-lg">MandarinGame</span>
        </div>
        <div class="flex items-center gap-3">
          <!-- Streak -->
          <div class="flex items-center gap-1 bg-orange-50 rounded-full px-3 py-1">
            <span class="text-orange-500">🔥</span>
            <span class="text-orange-600 font-bold text-sm">{{ auth.user?.streakDays || 0 }}天</span>
          </div>
          <!-- 积分 -->
          <div class="flex items-center gap-1 bg-yellow-50 rounded-full px-3 py-1">
            <span class="text-yellow-500">⭐</span>
            <span class="text-yellow-700 font-bold text-sm">{{ auth.user?.totalScore || 0 }}</span>
          </div>
          <!-- 头像菜单 -->
          <n-dropdown :options="menuOptions" @select="handleMenuSelect">
            <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer">
              <span class="text-white text-sm font-bold">{{ userInitial }}</span>
            </div>
          </n-dropdown>
        </div>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- 欢迎横幅 -->
      <div class="gradient-bg rounded-2xl p-6 mb-6 shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-amber-800">
              你好，{{ auth.user?.username }}！👋
            </h2>
            <p class="text-amber-700 mt-1">今天继续练习发音吧</p>
            <div class="flex gap-4 mt-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-amber-800">{{ stats?.todayCorrect || 0 }}</div>
                <div class="text-xs text-amber-600">今日答对</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-amber-800">{{ Math.round(stats?.recentAccuracy || 0) }}%</div>
                <div class="text-xs text-amber-600">近期正确率</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-amber-800">{{ auth.user?.streakDays || 0 }}</div>
                <div class="text-xs text-amber-600">连击天数</div>
              </div>
            </div>
          </div>
          <div class="text-6xl">🎯</div>
        </div>
      </div>

      <!-- Streak 提示 -->
      <div v-if="streak" class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span class="text-3xl">🔥</span>
        <div>
          <p class="font-semibold text-orange-700">连击 {{ streak.streakDays }} 天！</p>
          <p class="text-sm text-orange-600">
            再坚持 {{ streak.nextMilestone - streak.streakDays }} 天：{{ streak.rewardForNextMilestone }}
          </p>
        </div>
      </div>

      <!-- 关卡地图 -->
      <h3 class="text-lg font-bold text-gray-800 mb-4">🗺️ 关卡地图</h3>
      <div class="grid gap-4">
        <div
          v-for="level in levels"
          :key="level.id"
          :class="[
            'card cursor-pointer transition-all duration-200 hover:shadow-lg',
            isUnlocked(level.id) ? 'opacity-100' : 'opacity-50 cursor-not-allowed',
            currentLevel === level.id ? 'ring-2 ring-amber-400' : '',
          ]"
          @click="isUnlocked(level.id) && startLevel(level.id)"
        >
          <div class="flex items-center gap-4">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0', getLevelBg(level.id)]">
              {{ getLevelIcon(level.id) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-gray-800">第{{ level.id }}关：{{ level.name }}</h4>
                <span v-if="isCompleted(level.id)" class="text-green-500 text-sm">✅</span>
                <span v-else-if="!isUnlocked(level.id)" class="text-gray-400 text-sm">🔒</span>
              </div>
              <p class="text-sm text-gray-500 mt-0.5">{{ level.description }}</p>
              <div class="flex items-center gap-3 mt-2">
                <div class="flex gap-1">
                  <span
                    v-for="i in 5"
                    :key="i"
                    :class="i <= level.difficulty ? 'text-amber-400' : 'text-gray-200'"
                  >⭐</span>
                </div>
                <span class="text-xs text-gray-400">5道题 · 目标{{ level.minScore }}分</span>
              </div>
            </div>
            <div v-if="isUnlocked(level.id)" class="text-amber-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <RouterLink to="/error-book" class="card flex items-center gap-3 hover:shadow-lg transition-shadow cursor-pointer">
          <span class="text-3xl">📖</span>
          <div>
            <div class="font-semibold text-gray-800">错题本</div>
            <div class="text-sm text-gray-500">复习错题</div>
          </div>
        </RouterLink>
        <RouterLink to="/achievements" class="card flex items-center gap-3 hover:shadow-lg transition-shadow cursor-pointer">
          <span class="text-3xl">🏆</span>
          <div>
            <div class="font-semibold text-gray-800">成就</div>
            <div class="text-sm text-gray-500">{{ myAchievementsCount }} 个已获得</div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { NDropdown } from 'naive-ui'
import { useAuthStore } from '../stores/auth'
import { useProgressStore } from '../stores/progress'

const router = useRouter()
const auth = useAuthStore()
const progressStore = useProgressStore()

const stats = computed(() => progressStore.stats)
const streak = computed(() => progressStore.streak)
const currentLevel = computed(() => progressStore.progress?.currentLevel || 1)
const myAchievementsCount = computed(() => progressStore.myAchievements.length)

const userInitial = computed(() => {
  return auth.user?.username?.charAt(0)?.toUpperCase() || '?'
})

const levels = [
  { id: 1, name: '声调入门', description: '学习四个基础声调区分', difficulty: 1, minScore: 30 },
  { id: 2, name: '平翘舌', description: 'z/zh, s/sh, c/ch 的区分', difficulty: 2, minScore: 35 },
  { id: 3, name: '前后鼻音', description: 'n/ng 韵母区分', difficulty: 2, minScore: 35 },
  { id: 4, name: 'l/n 混淆', description: 'l 与 n 声母的区分', difficulty: 3, minScore: 40 },
  { id: 5, name: '综合挑战', description: '综合各类易混淆音', difficulty: 4, minScore: 45 },
  { id: 6, name: '大师关卡', description: '最高难度综合测试', difficulty: 5, minScore: 50 },
]

function isUnlocked(levelId: number) {
  return levelId <= (currentLevel.value)
}

function isCompleted(levelId: number) {
  return levelId < (currentLevel.value)
}

function getLevelBg(levelId: number) {
  const colors = ['', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-orange-100', 'bg-red-100', 'bg-purple-100']
  return colors[levelId] || 'bg-gray-100'
}

function getLevelIcon(levelId: number) {
  const icons = ['', '🔤', '👅', '👂', '🗣️', '🌟', '💎']
  return icons[levelId] || '📚'
}

function startLevel(levelId: number) {
  router.push(`/game/${levelId}`)
}

const menuOptions = [
  { label: '个人信息', key: 'profile' },
  { label: '退出登录', key: 'logout' },
]

function handleMenuSelect(key: string) {
  if (key === 'logout') {
    auth.logout()
    router.push('/auth')
  }
}

onMounted(() => {
  progressStore.fetchStats()
})
</script>
