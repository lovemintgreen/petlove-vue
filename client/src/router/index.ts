import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/home/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'loading',
      component: () => import('@/views/home/LoadingPageView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/member/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/member/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/member',
      component: () => import('@/views/member/MemberLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'member',
          component: () => import('@/views/member/MemberView.vue'),
        },
        {
          path: 'userpage',
          name: 'member-userpage',
          component: () => import('@/views/member/MemberUserPageView.vue'),
        },
        {
          path: 'history',
          name: 'member-history',
          component: () => import('@/views/member/MemberHistoryView.vue'),
        },
        {
          path: 'request',
          name: 'member-request',
          component: () => import('@/views/member/MemberRequestView.vue'),
        },
        {
          path: 'mission',
          name: 'member-mission',
          component: () => import('@/views/member/MemberMissionView.vue'),
        },
        {
          path: 'adoption',
          name: 'member-adoption',
          component: () => import('@/views/member/MemberAdoptionView.vue'),
        },
        {
          path: 'userinfo',
          name: 'member-userinfo',
          component: () => import('@/views/member/MemberUserInfoView.vue'),
        },
        {
          path: 'jobsetting',
          name: 'member-jobsetting',
          component: () => import('@/views/member/MemberJobSettingView.vue'),
        },
        {
          path: 'password',
          name: 'member-password',
          component: () => import('@/views/member/MemberPasswordView.vue'),
        },
        {
          path: 'payment',
          name: 'member-payment',
          component: () => import('@/views/member/MemberPaymentView.vue'),
        },
        {
          path: 'card-add',
          redirect: { name: 'member-payment' },
        },
        {
          path: 'logistic',
          name: 'member-logistic',
          component: () => import('@/views/member/MemberLogisticView.vue'),
        },
        {
          path: 'address',
          redirect: { name: 'member-logistic' },
        },
        {
          path: 'join-us',
          name: 'member-join-us',
          component: () => import('@/views/member/MemberJoinUsView.vue'),
        },
        {
          path: 'become-nanny',
          name: 'member-become-nanny',
          component: () => import('@/views/member/MemberPartnerFormView.vue'),
          props: { role: 'nanny' },
        },
        {
          path: 'become-walker',
          name: 'member-become-walker',
          component: () => import('@/views/member/MemberPartnerFormView.vue'),
          props: { role: 'walker' },
        },
        {
          path: 'contact-nanny',
          name: 'member-contact-nanny',
          component: () => import('@/views/member/MemberContactView.vue'),
          props: { role: 'nanny' },
        },
        {
          path: 'contact-guest',
          name: 'member-contact-guest',
          component: () => import('@/views/member/MemberContactView.vue'),
          props: { role: 'guest' },
        },
        {
          path: 'orderscore',
          name: 'member-orderscore',
          component: () => import('@/views/member/MemberOrderScoreView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.initialized) {
    await authStore.fetchMe()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { name: 'member' }
  }
})

export default router
