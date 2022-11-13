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

  // LISTS
  {
    path: '/persons',
    name: 'persons',
    component: () => import('../views/PersonsPage.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsPage.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/TasksPage.vue')
  },

  // FORMS
  {
    path: '/projectform',
    name: 'projectForm',
    component: () => import('../views/forms/ProjectFormPage.vue')
  },
  {
    path: '/personform',
    name: 'personForm',
    component: () => import('../views/forms/PersonFormPage.vue')
  },
  {
    path: '/taskform',
    name: 'taskForm',
    component: () => import('../views/forms/TaskFormPage.vue')
  },

  // EDIT FORMS
  {
    path: '/projectform/:id',
    name: 'projectFormEdit',
    component: () => import('../views/forms/ProjectFormPage.vue')
  },
  {
    path: '/taskform/:id',
    name: 'taskFormEdit',
    component: () => import('../views/forms/TaskFormPage.vue')
  },
  {
    path: '/personform/:id',
    name: 'personFormEdit',
    component: () => import('../views/forms/PersonFormPage.vue')
  },

  // DETAIL PAGES
  {
    path: '/persondetail/:id',
    name: 'personDetail',
    component: () => import('../views/PersonDetailPage.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
