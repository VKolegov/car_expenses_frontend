import { ref } from 'vue';
import { defineStore } from 'pinia';

import { authUsingTelegram, login } from '@/api/auth.js';
import { fetchMe, fetchUserCars } from '@/api/user.js';

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
            const response = await authUsingTelegram(initData);

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
            setUser(await fetchMe());
            return true;
        } catch (e) {
            if (e.code === 401) {
                return false;
            }
        }

        return false;
    }

    /** @type {import('vue').Ref<UserCar[]>} */
    const userCars = ref([]);

    /**
     * @param {UserCar[]} cars
     */
    function setCars (cars = []) {
        userCars.value = cars;
    }

    /**
     * @param {UserCar} car
     */
    function addUserCar(car) {
        userCars.value.push(car);
        userCars.value.sort(
            (c1, c2) => c2.id - c1.id
        );
    }

    async function fetchCurrentUserCars () {
        setCars(await fetchUserCars());
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

        userCars, fetchCurrentUserCars, addUserCar,

        displayNotification, notificationDisplayed, notificationText, notificationColor
    };
});