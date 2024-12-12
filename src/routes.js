import TheWelcome from "@/components/TheWelcome.vue";
import AddFuelExpenseForm from "@/components/AddFuelExpenseForm.vue";
import Login from "@/components/Login.vue";

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
        name: 'add_fuel_expense',
        meta: {
            auth: true,
        },
        path: '/fuel_expenses/add',
        component: AddFuelExpenseForm
    }
]

export default routes;