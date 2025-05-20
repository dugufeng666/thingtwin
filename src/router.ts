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

// 根据环境设置 base 路径
const base = import.meta.env.MODE === 'production' ? '/thingtwin/' : '/';

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

// 添加全局导航守卫
router.beforeEach((_to, _from, next) => {
  // 确保页面滚动到顶部
  window.scrollTo(0, 0);
  next();
});

export default router;
