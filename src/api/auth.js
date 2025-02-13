import { baseURL, postRequest } from '@/api/basic_api.js';

/**
 *
 * @param {string} initData telegram app init data
 * @returns {Promise<LoginResponse>}
 */
export async function authUsingTelegram(initData) {
    return await postRequest(`${baseURL}/telegram/auth`, {
        tg_raw_data: initData,
    });
}

/**
 *
 * @param {string} phone
 * @param {string} password
 * @returns {Promise<LoginResponse>}
 */
export async function login(phone, password) {
    return await postRequest(`${baseURL}/users/login`, {
        phone,
        password,
    });
}

