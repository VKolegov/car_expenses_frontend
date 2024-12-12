import './assets/main.css'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import {createApp} from 'vue'

import App from './App.vue'
import routes from "@/routes.js";
import {createRouter, createWebHistory} from "vue-router";
import {createPinia} from "pinia";
import {useUserStore} from "@/store.js";

const vuetify = createVuetify({
    components,
    directives,
});

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach(async (to, from, next) => {
    const store = useUserStore();

    if (to.meta.auth && !store.user) {
        const legit = await store.authIsLegit();

        if (!legit) {
            await next({
                name: 'login',
            })
        }
    }


    await next();

});

const pinia = createPinia();

createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app');

