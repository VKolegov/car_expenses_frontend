import TheWelcome from "@/components/TheWelcome.vue";
import AddFuelExpenseForm from "@/components/AddFuelExpenseForm.vue";
import Login from "@/components/Login.vue";
import RefillHistory from "@/components/RefillHistory.vue";
import Refills from "@/pages/Refills.vue";

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
                component: AddFuelExpenseForm
            }
        ]
    },
]

export default routes;