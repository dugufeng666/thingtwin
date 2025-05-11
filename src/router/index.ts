import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/meta2d',
      name: 'meta2d',
      component: () => import('../views/Meta2dEditorView.vue')
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('../views/TemplatesView.vue')
    }
  ]
})

export default router 