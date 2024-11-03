import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/firebase'

const routes = [
  { path: '/', component: () => import('@/views/LoginView.vue') },
  {
    path: '/home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/category/:categoryId',
    component: () => import('@/views/CategoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/add-product',
    component: () => import('@/views/AddProductView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/add-category',
    component: () => import('@/views/AddCategoryView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y no hay usuario autenticado, redirige a login
    next('/')
  } else if (to.path === '/' && isAuthenticated) {
    // Si el usuario está autenticado e intenta ir al login, redirige a home
    next('/home')
  } else {
    // En cualquier otro caso, permite la navegación
    next()
  }
})

export default router
