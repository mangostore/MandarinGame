<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-notification-provider>
        <div class="min-h-screen bg-gray-50">
          <router-view />
          <!-- 成就弹出通知 -->
          <AchievementToast />
        </div>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NNotificationProvider, zhCN, dateZhCN } from 'naive-ui'
import AchievementToast from './components/AchievementToast.vue'

const themeOverrides = {
  common: {
    primaryColor: '#f59e0b',
    primaryColorHover: '#d97706',
    primaryColorPressed: '#b45309',
    primaryColorSuppl: '#fbbf24',
  },
}
</script>
