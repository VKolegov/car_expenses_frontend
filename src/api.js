import {
    baseURL_GO,
    getRequest,
    postRequest,
    putRequest,
} from '@/basic_api.js';

// new api (go)

/**
 *
 * @param {string} initData telegram app init data
 * @returns {Promise<LoginResponse>}
 */
export async function authUsingTelegram(initData) {
    return await postRequest(`${baseURL_GO}/telegram/auth`, {
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
    return await postRequest(`${baseURL_GO}/users/login`, {
        phone,
        password,
    });
}


export async function fetchMe() {
    return await getRequest(`${baseURL_GO}/users/me`);
}

export async function fetchUserCars() {
    return await getRequest(`${baseURL_GO}/cars`);
}

/**
 * @param {number|null} carId
 * @returns {Promise<HistoryRecord[]>}
 */
export async function fetchHistoryRecords(carId = null) {
    const url = `${baseURL_GO}/history_records`;

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
    return await getRequest(`${baseURL_GO}/history_records/${id}`);
}


/**
 * @param {Object} data TODO
 * @returns {Promise<HistoryRecord>}
 */
export async function createHistoryRecord(data) {
    return await postRequest(`${baseURL_GO}/history_records`, data);
}


export async function updateHistoryRecord(recordId, data) {
    return await putRequest(`${baseURL_GO}/history_records/${recordId}`, data);
}


/**
 *
 * @param {number} carId
 * @returns {Promise<TotalCarStats>}
 */
export async function fetchCarStats(carId) {
    return await getRequest(`${baseURL_GO}/stats/car/${carId}`);
}


/**
 *
 * @param {number} carId
 * @param {Date} date
 * @returns {Promise<HistoryRecord>}
 */
export async function fetchBeforeDate(carId, date) {
    return await getRequest(`${baseURL_GO}/history_records/before_date`, {
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
    return await postRequest(`${baseURL_GO}/ai/invoice_items_description`,
        { items });
}