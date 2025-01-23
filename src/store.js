import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
    fetchCarsNew,
    login,
    meNew,
    telegramLoginNew,
} from '@/api.js';
import storageHelper, { TOKEN_KEY } from '@/local_storage.js';

export const useUserStore = defineStore('user', () => {
    const user = ref(null);

    function setUser (data) {
        user.value = data;
    }

    async function auth (phone, password) {
        try {
            const response = await login(phone, password);

            if (response.token) {
                storageHelper.set(TOKEN_KEY, response.token);
            }
            if (response.user) {
                setUser(response.user);
            }

            return true;
        } catch (e) {
            console.error(e);
        }

        return false;
    }

    async function telegramAuth (initData) {

        try {
            const response = await telegramLoginNew(initData);

            setUser(response.user);

            storageHelper.set(TOKEN_KEY, response.token);

            return true;
        } catch (error) {
            console.error('Telegram auth error', error);
        }

        return false;
    }

    async function authIsLegit () {
        let token = storageHelper.get(TOKEN_KEY);

        if (!token) {
            return false;
        }

        try {
            setUser(await meNew());
            return true;
        } catch (e) {
            if (e.code === 401) {
                return false;
            }
        }

        return false;
    }

    const userCars = ref([]);

    function setCars (cars = []) {
        userCars.value = cars;
    }

    async function fetchUserCars () {
        setCars(await fetchCarsNew());
    }


    const notificationDisplayed = ref(false);
    const notificationColor = ref('success');
    const notificationText = ref('');

    function displayNotification(text, color = 'success') {
        notificationDisplayed.value = true;
        notificationText.value = text;
        notificationColor.value = color;
    }

    return {
        user, auth, telegramAuth, authIsLegit, setUser,

        userCars, fetchUserCars,

        displayNotification, notificationDisplayed, notificationText, notificationColor
    };
});