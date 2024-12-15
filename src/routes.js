import TheWelcome from "@/components/TheWelcome.vue";
import AddFuelExpenseForm from "@/components/AddFuelExpenseForm.vue";
import Login from "@/components/Login.vue";
import {Static} from "vue";
import Statistics from "@/components/Statistics.vue";

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
        name: 'statistics',
        path: '/statistics',
        meta: {
            auth: true,
        },
        component: Statistics,
    },
    {
        name: 'add_fuel_expense',
        path: '/fuel_expenses/add',
        meta: {
            auth: true,
        },
        component: AddFuelExpenseForm
    }
]

export default routes;