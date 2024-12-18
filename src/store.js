import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchCars, login, me, telegramLogin } from '@/api.js';
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
            const response = await telegramLogin(initData);

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
            setUser(await me());
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
        setCars(await fetchCars());
    }

    return {
        user, auth, telegramAuth, authIsLegit, setUser,

        userCars, fetchUserCars,
    };
});