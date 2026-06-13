import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      component: () => import('../views/AuthView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/game/:level',
      component: () => import('../views/GameView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/error-book',
      component: () => import('../views/ErrorBookView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/achievements',
      component: () => import('../views/AchievementsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/auth')
  } else if (to.meta.requiresGuest && auth.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
