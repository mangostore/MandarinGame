import { defineStore } from 'pinia'
import { ref } from 'vue'
import { questionsApi, evaluationApi, progressApi } from '../api'

export const useGameStore = defineStore('game', () => {
  const currentQuestions = ref<any[]>([])
  const currentIndex = ref(0)
  const currentQuestion = ref<any>(null)
  const sessionScore = ref(0)
  const sessionCorrect = ref(0)
  const sessionStreak = ref(0)
  const isLoading = ref(false)
  const lastResult = ref<any>(null)
  const levelId = ref(1)

  async function loadLevel(id: number) {
    isLoading.value = true
    levelId.value = id
    sessionScore.value = 0
    sessionCorrect.value = 0
    sessionStreak.value = 0
    currentIndex.value = 0
    try {
      const questions: any = await questionsApi.getLevel(id)
      currentQuestions.value = questions
      currentQuestion.value = questions[0] || null
    } finally {
      isLoading.value = false
    }
  }

  async function submitAnswer(userAnswer: string, responseTime: number) {
    if (!currentQuestion.value) return null
    isLoading.value = true
    try {
      const result: any = await evaluationApi.submit({
        questionId: currentQuestion.value.id,
        userAnswer,
        responseTime,
      })
      lastResult.value = result
      if (result.isCorrect) {
        sessionScore.value += result.score
        sessionCorrect.value++
        sessionStreak.value++
      } else {
        sessionStreak.value = 0
      }
      return result
    } finally {
      isLoading.value = false
    }
  }

  function nextQuestion() {
    currentIndex.value++
    if (currentIndex.value < currentQuestions.value.length) {
      currentQuestion.value = currentQuestions.value[currentIndex.value]
      return true
    }
    return false
  }

  function isLevelComplete() {
    return currentIndex.value >= currentQuestions.value.length
  }

  async function finishLevel() {
    const total = currentQuestions.value.length
    const isPerfect = sessionCorrect.value === total
    await progressApi.completeLevel({
      levelId: levelId.value,
      score: sessionScore.value,
      isPerfect,
    })
    return { score: sessionScore.value, correct: sessionCorrect.value, total, isPerfect }
  }

  return {
    currentQuestions,
    currentIndex,
    currentQuestion,
    sessionScore,
    sessionCorrect,
    sessionStreak,
    isLoading,
    lastResult,
    levelId,
    loadLevel,
    submitAnswer,
    nextQuestion,
    isLevelComplete,
    finishLevel,
  }
})
