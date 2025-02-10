import {
    baseURL,
    getRequest,
    postRequest,
    putRequest,
} from '@/basic_api.js';

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 */

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


export async function fetchMe() {
    return await getRequest(`${baseURL}/users/me`);
}

export async function fetchUserCars() {
    return await getRequest(`${baseURL}/cars`);
}

/**
 * @param {number|null} carId
 * @returns {Promise<HistoryRecord[]>}
 */
export async function fetchHistoryRecords(carId = null) {
    const url = `${baseURL}/history_records`;

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
    return await getRequest(`${baseURL}/history_records/${id}`);
}


/**
 * @param {Object} data TODO
 * @returns {Promise<HistoryRecord>}
 */
export async function createHistoryRecord(data) {
    return await postRequest(`${baseURL}/history_records`, data);
}


export async function updateHistoryRecord(recordId, data) {
    return await putRequest(`${baseURL}/history_records/${recordId}`, data);
}


/**
 *
 * @param {number} carId
 * @returns {Promise<TotalCarStats>}
 */
export async function fetchCarStats(carId) {
    return await getRequest(`${baseURL}/stats/car/${carId}`);
}


/**
 *
 * @param {number} carId
 * @param {Date} date
 * @returns {Promise<HistoryRecord>}
 */
export async function fetchBeforeDate(carId, date) {
    return await getRequest(`${baseURL}/history_records/before_date`, {
        car_id: carId,
        date: date.toISOString(),
    })
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