import { fetchHistoryRecord } from '@/api.js';

const Login = () => import('@/pages/Login.vue');
import TheWelcome from '@/pages/TheWelcome.vue';
import History from '@/pages/History.vue';
import VehicleHistory from '@/components/VehicleHistory.vue';
import FuelCharts from '@/components/FuelCharts.vue';

const FuelExpenseForm = () => import('@/components/FuelExpenseForm.vue');

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
        path: '/history',
        meta: {
            auth: true,
        },
        component: History,
        children: [
            {
                name: 'history',
                path: '',
                meta: {
                    auth: true,
                },
                component: VehicleHistory,
            },
            {
                name: 'edit_history_record',
                path: ':id(\\d+)',
                meta: {
                    auth: true,
                },
                component: FuelExpenseForm,
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
                name: 'add_history_record',
                path: 'add',
                meta: {
                    auth: true,
                },
                component: FuelExpenseForm,
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