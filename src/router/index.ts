import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/contacts',
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/pages/ContactsListPage.vue'),
  },
  {
    path: '/contacts/new',
    name: 'contact-create',
    component: () => import('@/pages/ContactCreatePage.vue'),
  },
  {
    path: '/contacts/:contactId',
    name: 'contact-detail',
    component: () => import('@/pages/ContactDetailPage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/contacts',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
