import TheWelcome from "@/components/TheWelcome.vue";
import AddFuelExpenseForm from "@/components/AddFuelExpenseForm.vue";
import Login from "@/components/Login.vue";
import RefillHistory from "@/components/RefillHistory.vue";

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
        name: 'refill_history',
        path: '/refill_history',
        meta: {
            auth: true,
        },
        component: RefillHistory,
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