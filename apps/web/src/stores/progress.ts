import { defineStore } from 'pinia'
import { ref } from 'vue'
import { progressApi, rewardsApi } from '../api'

export const useProgressStore = defineStore('progress', () => {
  const progress = ref<any>(null)
  const stats = ref<any>(null)
  const streak = ref<any>(null)
  const myAchievements = ref<any[]>([])
  const newAchievements = ref<any[]>([])
  const isLoading = ref(false)

  async function fetchStats() {
    isLoading.value = true
    try {
      const [statsRes, streakRes, achRes] = await Promise.all([
        progressApi.getStats() as any,
        rewardsApi.getStreak() as any,
        rewardsApi.getMyAchievements() as any,
      ])
      stats.value = statsRes
      progress.value = statsRes.progress
      streak.value = streakRes
      myAchievements.value = achRes
    } finally {
      isLoading.value = false
    }
  }

  function addNewAchievement(achievement: any) {
    newAchievements.value.push(achievement)
    setTimeout(() => {
      newAchievements.value = newAchievements.value.filter((a) => a !== achievement)
    }, 5000)
  }

  return { progress, stats, streak, myAchievements, newAchievements, isLoading, fetchStats, addNewAchievement }
})
