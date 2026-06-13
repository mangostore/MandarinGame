<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部 -->
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <button @click="goBack" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1">
          <h1 class="font-bold text-gray-800">
            第{{ levelId }}关：{{ levelName }}
          </h1>
          <!-- 进度条 -->
          <div class="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 transition-all duration-500"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-amber-500">⭐</span>
          <span class="font-bold text-amber-700">{{ gameStore.sessionScore }}</span>
          <span v-if="gameStore.sessionStreak > 1" class="ml-2 text-orange-500 font-bold">
            🔥×{{ gameStore.sessionStreak }}
          </span>
        </div>
      </div>
    </nav>

    <!-- 加载中 -->
    <div v-if="gameStore.isLoading && !currentQuestion" class="flex items-center justify-center min-h-[60vh]">
      <n-spin size="large" />
    </div>

    <!-- 通关画面 -->
    <div v-else-if="levelComplete" class="max-w-2xl mx-auto px-4 py-12 text-center">
      <div class="text-8xl mb-6 animate-bounce">
        {{ completionResult?.isPerfect ? '🌟' : '🎉' }}
      </div>
      <h2 class="text-3xl font-bold text-gray-800 mb-2">
        {{ completionResult?.isPerfect ? '完美通关！' : '关卡完成！' }}
      </h2>
      <p class="text-gray-600 mb-6">
        答对 {{ completionResult?.correct }}/{{ completionResult?.total }} 题
      </p>
      <div class="card mb-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-500">{{ completionResult?.score }}</div>
            <div class="text-sm text-gray-500">本关得分</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">
              {{ completionResult?.total ? Math.round((completionResult.correct / completionResult.total) * 100) : 0 }}%
            </div>
            <div class="text-sm text-gray-500">正确率</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-500">{{ gameStore.sessionStreak }}</div>
            <div class="text-sm text-gray-500">最大连击</div>
          </div>
        </div>
      </div>

      <!-- 新成就 -->
      <div v-if="newAchievements.length > 0" class="mb-6">
        <h3 class="font-semibold text-gray-700 mb-3">🏆 解锁新成就</h3>
        <div class="flex flex-wrap gap-3 justify-center">
          <div
            v-for="a in newAchievements"
            :key="a.id"
            class="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 flex items-center gap-2 achievement-pop"
          >
            <span class="text-2xl">{{ a.icon }}</span>
            <div class="text-left">
              <div class="font-semibold text-yellow-800 text-sm">{{ a.name }}</div>
              <div class="text-xs text-yellow-600">{{ a.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 justify-center">
        <button @click="replayLevel" class="btn-secondary">再次挑战</button>
        <button @click="goBack" class="btn-primary">返回地图</button>
        <button v-if="levelId < 6" @click="goNextLevel" class="btn-primary">下一关 →</button>
      </div>
    </div>

    <!-- 游戏主界面 -->
    <div v-else-if="currentQuestion" class="max-w-2xl mx-auto px-4 py-6">
      <!-- 题目卡片 -->
      <div
        ref="questionCard"
        :class="[
          'card mb-6 text-center transition-all duration-300',
          answerState === 'correct' ? 'correct-flash' : '',
          answerState === 'wrong' ? 'wrong-shake' : '',
        ]"
      >
        <div class="text-7xl font-bold text-gray-800 mb-4 leading-none">
          {{ currentQuestion.text }}
        </div>
        <div v-if="showPinyin || answerState !== 'idle'" class="text-2xl text-gray-500 mb-2">
          {{ currentQuestion.pinyin }}
        </div>
        <div class="flex justify-center gap-2 flex-wrap">
          <span
            v-for="(c, i) in (currentQuestion.confusableWith || [])"
            :key="i"
            class="text-sm bg-gray-100 text-gray-600 rounded-full px-3 py-1"
          >{{ c }}</span>
        </div>
        <div v-if="currentQuestion.hint && showPinyin" class="mt-3 text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
          💡 {{ currentQuestion.hint }}
        </div>
      </div>

      <!-- 反馈区域 -->
      <div
        v-if="answerState !== 'idle'"
        :class="[
          'rounded-xl p-4 mb-4 text-center font-semibold',
          answerState === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        ]"
      >
        <div class="text-2xl mb-1">{{ answerState === 'correct' ? '✅' : '❌' }}</div>
        <div>{{ gameStore.lastResult?.feedback }}</div>
        <div v-if="answerState === 'correct'" class="text-sm mt-1 text-green-600">
          +{{ gameStore.lastResult?.score }} 分
          <span v-if="gameStore.sessionStreak > 1" class="text-orange-500"> (连击×{{ gameStore.sessionStreak }}🔥)</span>
        </div>
        <div v-if="userSpeech" class="mt-2 text-sm text-gray-600">
          识别到：「{{ userSpeech }}」
        </div>
      </div>

      <!-- 录音控制区 -->
      <div class="card text-center">
        <p class="text-gray-600 mb-4">
          {{ recordingState === 'idle' ? '点击麦克风开始录音，说出汉字的读音' : '' }}
          {{ recordingState === 'recording' ? '🎤 正在录音，请大声说出读音...' : '' }}
          {{ recordingState === 'processing' ? '⏳ 正在识别...' : '' }}
        </p>

        <!-- 录音按钮 -->
        <button
          @click="toggleRecording"
          :disabled="!speechSupported || recordingState === 'processing' || answerState !== 'idle'"
          :class="[
            'w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl transition-all duration-200 shadow-lg',
            recordingState === 'recording' ? 'bg-red-500 recording-active scale-110' : 'bg-amber-500 hover:bg-amber-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
        >
          {{ recordingState === 'recording' ? '⏹️' : '🎤' }}
        </button>

        <div v-if="!speechSupported" class="mt-3 text-sm text-red-500">
          ⚠️ 您的浏览器不支持语音识别，请使用 Chrome 浏览器
        </div>

        <!-- 手动输入备选 -->
        <div class="mt-4 flex gap-2">
          <input
            v-model="manualInput"
            type="text"
            class="input-field flex-1 text-center"
            placeholder="或手动输入答案（汉字/拼音）"
            @keyup.enter="submitManual"
            :disabled="answerState !== 'idle'"
          />
          <button
            @click="submitManual"
            :disabled="!manualInput || answerState !== 'idle'"
            class="btn-secondary px-4"
          >提交</button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3 mt-4">
        <button @click="toggleHint" class="btn-secondary flex-1 text-sm">
          {{ showPinyin ? '隐藏拼音' : '显示拼音' }}
        </button>
        <button
          v-if="answerState !== 'idle'"
          @click="goNext"
          class="btn-primary flex-1"
        >
          {{ currentIndex + 1 < totalQuestions ? '下一题 →' : '查看结果 🎉' }}
        </button>
      </div>

      <!-- 题目计数 -->
      <div class="text-center mt-4 text-sm text-gray-400">
        {{ currentIndex + 1 }} / {{ totalQuestions }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
import { useGameStore } from '../stores/game'
import { useProgressStore } from '../stores/progress'
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const progressStore = useProgressStore()

const levelId = computed(() => parseInt(route.params.level as string))
const levelNames: Record<number, string> = {
  1: '声调入门', 2: '平翘舌', 3: '前后鼻音',
  4: 'l/n混淆', 5: '综合挑战', 6: '大师关卡',
}
const levelName = computed(() => levelNames[levelId.value] || '练习')

const currentQuestion = computed(() => gameStore.currentQuestion)
const currentIndex = computed(() => gameStore.currentIndex)
const totalQuestions = computed(() => gameStore.currentQuestions.length)
const progress = computed(() =>
  totalQuestions.value > 0 ? Math.round(((currentIndex.value) / totalQuestions.value) * 100) : 0
)

const recordingState = ref<'idle' | 'recording' | 'processing'>('idle')
const answerState = ref<'idle' | 'correct' | 'wrong'>('idle')
const showPinyin = ref(false)
const userSpeech = ref('')
const manualInput = ref('')
const levelComplete = ref(false)
const completionResult = ref<any>(null)
const newAchievements = ref<any[]>([])
const startTime = ref(0)
const speechSupported = ref(false)

let recognition: any = null

function initSpeechRecognition() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    speechSupported.value = false
    return
  }
  speechSupported.value = true
  recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 3

  recognition.onresult = async (event: any) => {
    const results = []
    for (let i = 0; i < event.results[0].length; i++) {
      results.push(event.results[0][i].transcript)
    }
    userSpeech.value = results[0] || ''
    recordingState.value = 'processing'
    await processAnswer(userSpeech.value)
  }

  recognition.onerror = (event: any) => {
    console.error('Speech error:', event.error)
    recordingState.value = 'idle'
    if (event.error === 'no-speech') {
      userSpeech.value = ''
    }
  }

  recognition.onend = () => {
    if (recordingState.value === 'recording') {
      recordingState.value = 'idle'
    }
  }
}

function toggleRecording() {
  if (recordingState.value === 'recording') {
    recognition?.stop()
    recordingState.value = 'idle'
  } else if (recordingState.value === 'idle') {
    userSpeech.value = ''
    startTime.value = Date.now()
    recognition?.start()
    recordingState.value = 'recording'
  }
}

async function processAnswer(answer: string) {
  const responseTime = Date.now() - startTime.value
  const result = await gameStore.submitAnswer(answer, responseTime)
  if (result) {
    answerState.value = result.isCorrect ? 'correct' : 'wrong'
    if (result.isCorrect) {
      triggerCorrectEffect()
    }
    if (result.newAchievements?.length > 0) {
      newAchievements.value.push(...result.newAchievements)
      result.newAchievements.forEach((a: any) => progressStore.addNewAchievement(a))
    }
  }
  recordingState.value = 'idle'
}

async function submitManual() {
  if (!manualInput.value || answerState.value !== 'idle') return
  startTime.value = startTime.value || Date.now()
  await processAnswer(manualInput.value)
  manualInput.value = ''
}

function triggerCorrectEffect() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6'],
  })
}

function triggerLevelCompleteConfetti() {
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.5 },
  })
  setTimeout(() => {
    confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 } })
    confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 } })
  }, 300)
}

async function goNext() {
  answerState.value = 'idle'
  showPinyin.value = false
  userSpeech.value = ''
  const hasNext = gameStore.nextQuestion()
  if (!hasNext) {
    const result = await gameStore.finishLevel()
    completionResult.value = result
    levelComplete.value = true
    triggerLevelCompleteConfetti()
    await progressStore.fetchStats()
  }
}

function toggleHint() {
  showPinyin.value = !showPinyin.value
}

function goBack() {
  router.push('/')
}

async function replayLevel() {
  levelComplete.value = false
  newAchievements.value = []
  await gameStore.loadLevel(levelId.value)
}

function goNextLevel() {
  router.push(`/game/${levelId.value + 1}`)
}

onMounted(async () => {
  initSpeechRecognition()
  await gameStore.loadLevel(levelId.value)
  startTime.value = Date.now()
})

onUnmounted(() => {
  recognition?.abort()
})
</script>
