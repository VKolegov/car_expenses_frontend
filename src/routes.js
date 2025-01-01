import { fetchHistoryRecord } from '@/api.js';

const Login = () => import('@/pages/Login.vue');
import TheWelcome from '@/pages/TheWelcome.vue';
import Refills from '@/pages/Refills.vue';
import RefillHistory from '@/components/RefillHistory.vue';
import FuelCharts from '@/components/FuelCharts.vue';

const AddFuelExpenseForm = () => import('@/components/AddFuelExpenseForm.vue');

/** @type {import('vue-router').RouteLocation[]} */
const routes = [
    {
        path: '/',
        meta: {
            auth: true,
        },
        component: TheWelcome,
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
    {
        path: '/refills',
        meta: {
            auth: true,
        },
        component: Refills,
        children: [
            {
                name: 'refills',
                path: '',
                meta: {
                    auth: true,
                },
                component: RefillHistory,
            },
            {
                name: 'edit_refill',
                path: ':id(\\d+)',
                meta: {
                    auth: true,
                },
                component: AddFuelExpenseForm,
                props: true,
                beforeEnter: async (to, from, next) => {
                    if (to.params.id) {
                        const record = await fetchHistoryRecord(to.params.id);
                        console.log('beforeEnter', record);
                        to.params.record = record;
                    }

                    next();
                }
            },
            {
                name: 'add_refill',
                path: 'add',
                meta: {
                    auth: true,
                },
                component: AddFuelExpenseForm,
            },
        ],
    },
    {
        name: 'fuel_charts',
        path: '/fuel_charts',
        component: FuelCharts,
    },
];

export default routes;