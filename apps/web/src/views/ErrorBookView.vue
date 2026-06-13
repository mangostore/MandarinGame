<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </RouterLink>
        <h1 class="font-bold text-gray-800 text-lg">📖 错题本</h1>
      </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- 待复习提示 -->
      <div v-if="reviewList.length > 0" class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">⏰</span>
          <span class="font-semibold text-orange-700">有 {{ reviewList.length }} 道题待复习</span>
        </div>
        <RouterLink :to="`/game/review`" class="btn-primary inline-block text-sm">
          立即复习
        </RouterLink>
      </div>

      <!-- 标签切换 -->
      <n-tabs v-model:value="activeTab" type="bar" class="mb-4">
        <n-tab-pane name="all" :tab="`全部错题 (${errorBook.length})`" />
        <n-tab-pane name="review" :tab="`待复习 (${reviewList.length})`" />
      </n-tabs>

      <div v-if="isLoading" class="flex justify-center py-12">
        <n-spin />
      </div>

      <div v-else-if="displayList.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-5xl mb-4">🎉</div>
        <p>{{ activeTab === 'all' ? '暂无错题，继续保持！' : '没有待复习的题目' }}</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in displayList"
          :key="item.id"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl font-bold text-gray-800">{{ item.question.text }}</span>
                <span class="text-lg text-gray-500">{{ item.question.pinyin }}</span>
                <span :class="getTypeBadgeClass(item.question.type)" class="text-xs rounded-full px-2 py-0.5">
                  {{ getTypeLabel(item.question.type) }}
                </span>
              </div>
              <div v-if="item.question.hint" class="text-sm text-blue-600">
                💡 {{ item.question.hint }}
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="(c, i) in (item.question.confusableWith || [])"
                  :key="i"
                  class="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5"
                >{{ c }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 flex-shrink-0">
              <div class="flex items-center gap-1">
                <span class="text-red-500 font-bold text-lg">{{ item.errorCount }}</span>
                <span class="text-xs text-gray-400">次错误</span>
              </div>
              <div class="text-xs text-gray-400">
                复习：{{ formatDate(item.nextReviewAt) }}
              </div>
              <button
                @click="removeItem(item.id)"
                class="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                移除
              </button>
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
import { NTabs, NTabPane, NSpin } from 'naive-ui'
import { errorBookApi } from '../api'

const errorBook = ref<any[]>([])
const reviewList = ref<any[]>([])
const isLoading = ref(true)
const activeTab = ref('all')

const displayList = computed(() => {
  return activeTab.value === 'review' ? reviewList.value : errorBook.value
})

async function load() {
  isLoading.value = true
  try {
    const [all, review] = await Promise.all([
      errorBookApi.getAll() as any,
      errorBookApi.getReview() as any,
    ])
    errorBook.value = all
    reviewList.value = review
  } finally {
    isLoading.value = false
  }
}

async function removeItem(id: number) {
  await errorBookApi.remove(id)
  await load()
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = { TONE: '声调', INITIAL: '声母', FINAL: '韵母', MIXED: '综合' }
  return map[type] || type
}

function getTypeBadgeClass(type: string) {
  const map: Record<string, string> = {
    TONE: 'bg-blue-100 text-blue-700',
    INITIAL: 'bg-green-100 text-green-700',
    FINAL: 'bg-yellow-100 text-yellow-700',
    MIXED: 'bg-purple-100 text-purple-700',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return '今天'
  if (diffDays === 1) return '明天'
  return `${diffDays}天后`
}

onMounted(load)
</script>
