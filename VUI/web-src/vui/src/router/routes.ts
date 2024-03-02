import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

/* = createRouter({
    history: createWebHashHistory(),
    routes: */
const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/uikit/menu',
                component: () => import('@/views/uikit/Menu.vue'),
                children: [
                    {
                        path: '/uikit/menu',
                        component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                    },
                    {
                        path: '/uikit/menu/seat',
                        component: () => import('@/views/uikit/menu/SeatDemo.vue')
                    },
                    {
                        path: '/uikit/menu/payment',
                        component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/uikit/menu/confirmation',
                        component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                    }
                ]
            },
            {
                path: '/admin-home',
                name: 'Admin Home',
                component: () => import('@/views/pages/AdminHome.vue')
            },
        ]
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },

    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue')
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/Access.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    }
];
// });

export default routes;
