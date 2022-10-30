import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/home',
    name: 'home2',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/persons',
    name: 'persons',
    component: () => import('../views/PersonsPage.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/ProjectsPage.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/TasksPage.vue')
  },
  {
    path: '/projectform',
    name: 'projectForm',
    component: () => import('../views/forms/ProjectFormPage.vue')
  },
  {
    path: '/projectform/:id',
    name: 'projectFormEdit',
    component: () => import('../views/forms/ProjectFormPage.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
