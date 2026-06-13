<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </RouterLink>
        <h1 class="font-bold text-gray-800 text-lg">🏆 成就</h1>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- 统计概览 -->
      <div class="gradient-bg rounded-2xl p-6 mb-6 shadow-md">
        <div class="text-center">
          <div class="text-4xl font-bold text-amber-800">{{ unlockedCount }} / {{ allAchievements.length }}</div>
          <div class="text-amber-700 mt-1">成就已解锁</div>
          <div class="mt-3 h-3 bg-amber-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 transition-all duration-1000"
              :style="{ width: `${unlockPercent}%` }"
            />
          </div>
        </div>
      </div>

      <!-- 个人统计 -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="card text-center">
          <div class="text-2xl font-bold text-amber-500">{{ stats?.totalScore || 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">总积分</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-orange-500">{{ stats?.streakDays || 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">连击天数</div>
        </div>
        <div class="card text-center">
          <div class="text-2xl font-bold text-green-500">{{ stats?.progress?.totalCorrect || 0 }}</div>
          <div class="text-xs text-gray-500 mt-1">累计答对</div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <n-spin />
      </div>

      <!-- 成就列表 -->
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="achievement in allAchievements"
          :key="achievement.id"
          :class="[
            'card transition-all duration-300',
            isUnlocked(achievement.id) ? 'opacity-100 shadow-md' : 'opacity-50 grayscale',
          ]"
        >
          <div class="text-center">
            <div :class="['text-4xl mb-2', isUnlocked(achievement.id) ? 'star-burst' : '']">
              {{ achievement.icon }}
            </div>
            <div class="font-bold text-gray-800 text-sm">{{ achievement.name }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ achievement.description }}</div>
            <div v-if="isUnlocked(achievement.id)" class="mt-2">
              <span class="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5">
                ✅ 已解锁
              </span>
              <div class="text-xs text-gray-400 mt-1">
                {{ formatUnlockDate(getUnlockDate(achievement.id)) }}
              </div>
            </div>
            <div v-else class="mt-2 text-xs text-gray-400">
              {{ getProgressText(achievement) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { NSpin } from 'naive-ui'
import { rewardsApi } from '../api'
import { useProgressStore } from '../stores/progress'

const progressStore = useProgressStore()
const isLoading = ref(true)
const allAchievements = ref<any[]>([])
const myAchievements = ref<any[]>([])

const stats = computed(() => progressStore.stats)
const unlockedCount = computed(() => myAchievements.value.length)
const unlockPercent = computed(() =>
  allAchievements.value.length > 0
    ? Math.round((unlockedCount.value / allAchievements.value.length) * 100)
    : 0
)

function isUnlocked(achievementId: number) {
  return myAchievements.value.some((ua) => ua.achievementId === achievementId)
}

function getUnlockDate(achievementId: number) {
  const ua = myAchievements.value.find((ua) => ua.achievementId === achievementId)
  return ua?.unlockedAt
}

function formatUnlockDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日解锁`
}

function getProgressText(achievement: any) {
  const progress = progressStore.stats
  if (!progress) return '未解锁'
  switch (achievement.conditionType) {
    case 'STREAK':
      return `🔥 ${progress.streakDays || 0}/${achievement.conditionValue} 天`
    case 'COUNT':
      return `💯 ${progress.progress?.totalCorrect || 0}/${achievement.conditionValue} 题`
    case 'LEVEL':
      return `🗺️ 第${progress.progress?.currentLevel || 1}/${achievement.conditionValue}关`
    default:
      return '未解锁'
  }
}

async function load() {
  isLoading.value = true
  try {
    const [all, mine] = await Promise.all([
      rewardsApi.getAchievements() as any,
      rewardsApi.getMyAchievements() as any,
    ])
    allAchievements.value = all
    myAchievements.value = mine
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([load(), progressStore.fetchStats()])
})
</script>
