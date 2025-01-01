// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import './assets/main.css'; // override vuetify
import { createApp } from 'vue';

// vue-datepicker
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import App from './App.vue';
import routes from '@/routes.js';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { useUserStore } from '@/store.js';
import { VBtn, VCol, VForm, VIcon, VRow, VTextField } from 'vuetify/components';

const vuetify = createVuetify({
    components: {
        VIcon, VRow, VCol, VForm, VTextField, VBtn,
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useUserStore();

    if (to.meta.auth && !store.user) {
        const legit = await store.authIsLegit();

        if (legit) {
            await store.fetchUserCars();
            await next();
            return;
        }

        if (!window.Telegram?.WebApp?.initData) {
            await next({
                name: 'login',
            });
            return;
        }

        console.log('Telegram auth detected', window.Telegram.WebApp.initData);

        try {
            await store.telegramAuth(window.Telegram.WebApp.initData);
            await next();
        } catch (error) {
            console.error('Telegram auth error', error);
            await next({
                name: 'login',
            });
            return;
        }
    }

    if (store.userCars.length === 0) {
        await store.fetchUserCars();
    }

    await next();

});

const pinia = createPinia();

const app = createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia);

app.component('VueDatePicker', VueDatePicker);

app.mount('#app');

