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
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/SettingsView.vue')
      }
    ]
  },
  {
    path: '/travellist/:travelId?',
    component: () => import('@/components/TravelList.vue')
  },
  {
    path: '/travelform/:travelId?',
    component: () => import('@/views/TravelForm.vue')
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
    path: '/noteform',
    component: () => import('@/views/NoteView.vue')
  },
  {
    path: '/test',
    component: () => import('@/views/TestPageView.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
