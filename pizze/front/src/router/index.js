import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DodajPizzu from '../views/dodajPizzu.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dodajPizzu',
    name: 'dodajPizzu',
    component: DodajPizzu
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
