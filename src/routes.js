import { fetchHistoryRecord } from '@/api.js';
import TheWelcome from '@/pages/TheWelcome.vue';
import History from '@/pages/History.vue';
import VehicleHistory from '@/components/VehicleHistory.vue';
import FuelCharts from '@/components/FuelCharts.vue';
import Statistics from '@/pages/Statistics.vue';
import Garage from '@/pages/Garage.vue';

const Login = () => import('@/pages/Login.vue');

const HistoryRecordEditForm = () => import('@/components/HistoryRecordEditForm.vue');

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
                component: HistoryRecordEditForm,
                props: true,
                beforeEnter: async (to, from, next) => {
                    if (to.params.id) {
                        const record = await fetchHistoryRecord(to.params.id);
                        console.log('beforeEnter', record);
                        to.params.record = record;
                    }

                    next();
                },
            },
            {
                name: 'add_history_record',
                path: 'add',
                meta: {
                    auth: true,
                },
                component: HistoryRecordEditForm,
            },
        ],
    },
    {
        name: 'statistics',
        path: '/statistics',
        meta: {
            auth: true,
        },
        component: Statistics,
    },
    {
        name: 'fuel_charts',
        path: '/fuel_charts',
        meta: {
            auth: true,
        },
        component: FuelCharts,
    },
    {
        name: 'garage',
        path: '/garage',
        meta: {
            auth: true,
        },
        component: Garage,
    },
];

export default routes;