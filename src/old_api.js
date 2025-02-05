// old api (node.js)

import { baseURL, getRequest, patchRequest, postRequest } from '@/basic_api.js';



/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 */

/**
 *
 * @param {string} phone
 * @param {string} password
 * @returns {Promise<LoginResponse>}
 */
export async function login(phone, password) {
    return await postRequest(`${baseURL}/login`, {
        phone,
        password,
    });
}

/**
 *
 * @param {string} initData telegram app init data
 * @returns {Promise<LoginResponse>}
 */
export async function telegramLogin(initData) {
    return await postRequest(`${baseURL}/telegram/auth`, {
        tgRawData: initData,
    });
}


export async function me() {
    return await getRequest(`${baseURL}/me`);
}


export async function fetchCars() {
    const r = await getRequest(`${baseURL}/cars`);

    return r;
}

/**
 * @param {number|null} carId
 * @returns {Promise<HistoryRecord[]>}
 */
export async function fetchFuelExpensesHistory(carId = null) {
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
 * @returns {Promise<HistoryRecord>}
 */
export async function fetchHistoryRecord(id) {
    const r = await getRequest(`${baseURL}/history_records/${id}`);

    return r;
}

/**
 * @param {Object} data TODO
 * @returns {Promise<HistoryRecord>}
 */
export async function createHistoryRecord(data) {
    return await postRequest(`${baseURL}/history_records`, data);
}


export async function updateHistoryRecord(recordId, data) {
    return await patchRequest(`${baseURL}/history_records/${recordId}`, data);
}

/**
 *
 * @param {Object} data TODO
 * @returns {Promise<HistoryRecord>}
 */
export async function createFuelExpense(data) {
    return await postRequest(`${baseURL}/fuel_expenses`, data);
}

/**
 *
 * @param {number} carId
 * @returns {Promise<TotalCarStats>}
 */
export async function fetchCarStats(carId) {
    return await getRequest(`${baseURL}/stats/for_car/${carId}`);
}


/**
 *
 * @param {string[]} items
 * @returns {Promise<{response: string, cost: number}>}
 */
export async function getAiItemsDescription(items) {
    return await postRequest(`${baseURL}/ai/invoice_items_description`,
        { items });
}