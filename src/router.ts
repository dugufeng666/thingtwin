import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { 
    path: '/', 
    component: () => import('./views/Index.vue'),
    name: 'index'
  },
  { 
    path: '/preview', 
    component: () => import('./views/Preview.vue'),
    name: 'preview'
  },
  // 添加通配符路由
  { 
    path: '/:pathMatch(.*)*', 
    redirect: { name: 'index' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  // 确保页面滚动到顶部
  window.scrollTo(0, 0);
  next();
});

export default router;
