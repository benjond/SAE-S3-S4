import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'Introduction',
        component: () => import('@/views/Home.vue')
    },
    {
      path : '/map',
      name : 'Map Interactif',
      component : () => import('@/views/Map.vue')
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
