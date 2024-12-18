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