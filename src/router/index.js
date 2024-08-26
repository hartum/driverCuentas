import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'
import WelcomeView from '@/views/WelcomeView.vue'

const routes = [
  {
    path: '/',
    component: WelcomeView
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1/:refresh?',
        component: () => import('@/views/TravelView.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Datos.vue')
      },
      {
        path: 'tab3/:refresh?',
        component: () => import('@/views/SettingsView.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/ImportExportView.vue')
      }
    ]
  },
  {
    path: '/travellist/:travelId?',
    component: () => import('@/components/TravelList.vue')
  },
  {
    path: '/travelform/:shiftId/:travelId?',
    component: () => import('@/views/TravelFormView.vue')
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsView.vue')
  },
  {
    path:'/shift/:shiftId?',
    component: () => import('@/views/ShiftFormView.vue')
  },
  {
    path: '/noteform/:shiftId/:noteId?',
    component: () => import('@/views/NoteFormView.vue')
  },
  {
    path: '/test',
    component: () => import('@/views/TestPageView.vue')
  },
  {
    path: '/map/:refresh?',
    component: () => import('@/components/SettingsMap.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
