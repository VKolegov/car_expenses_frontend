import { baseURL, getRequest, patchRequest, postRequest } from '@/basic_api.js';

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 */

/**
 *
 * @param phone
 * @param password
 * @returns {Promise<LoginResponse>}
 */
export async function login (phone, password) {
    const r = await postRequest(`${baseURL}/login`, {
        phone,
        password,
    });

    return r;
}

/**
 *
 * @param {string} initData telegram app init data
 * @returns {Promise<LoginResponse>}
 */
export async function telegramLogin (initData) {
    return await postRequest(`${baseURL}/telegram/auth`, {
        tgRawData: initData,
    });
}

export async function me () {
    return await getRequest(`${baseURL}/me`);
}

export async function fetchCars () {
    const r = await getRequest(`${baseURL}/cars`);

    return r;
}

/**
 * @param {number|null} carId
 * @returns {Promise<HistoryRecord<HistoryRefillData>[]>}
 */
export async function fetchFuelExpensesHistory (carId = null) {
    const url = `${baseURL}/fuel_expenses`;

    if (carId) {
        return await getRequest(url, {
            car_id: carId,
        });
    }

    return await getRequest(url);
}

/**
 *
 * @param {number} id
 * @returns {Promise<HistoryRecord<HistoryRefillData>>}
 */
export async function fetchHistoryRecord(id) {
    const r = await getRequest(`${baseURL}/history_records/${id}`);

    return r;
}

export async function updateFuelExpense(recordId, data) {
    return await patchRequest(`${baseURL}/history_records/${recordId}`, data);
}

/**
 *
 * @param {Object} data TODO
 * @returns {Promise<HistoryRecord<HistoryRefillData>>}
 */
export async function createFuelExpense (data) {
    return await postRequest(`${baseURL}/fuel_expenses`, data);
}

/**
 *
 * @param {number} carId
 * @returns {Promise<TotalCarStats>}
 */
export async function fetchCarStats (carId) {
    return await getRequest(`${baseURL}/stats/for_car/${carId}`);
}
