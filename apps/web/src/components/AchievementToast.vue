<template>
  <TransitionGroup name="toast" tag="div" class="fixed bottom-6 right-4 z-50 space-y-3">
    <div
      v-for="achievement in progressStore.newAchievements"
      :key="achievement.name"
      class="bg-white border-2 border-yellow-300 rounded-2xl p-4 shadow-xl max-w-xs achievement-pop flex items-center gap-3"
    >
      <span class="text-3xl">{{ achievement.icon }}</span>
      <div>
        <div class="text-xs text-yellow-600 font-semibold uppercase tracking-wide">🏆 新成就解锁！</div>
        <div class="font-bold text-gray-800">{{ achievement.name }}</div>
        <div class="text-sm text-gray-500">{{ achievement.description }}</div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useProgressStore } from '../stores/progress'
const progressStore = useProgressStore()
</script>

<style scoped>
.toast-enter-active { animation: achievement-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-leave-active { transition: all 0.3s ease-in; }
.toast-leave-to { opacity: 0; transform: translateX(100px); }
</style>
