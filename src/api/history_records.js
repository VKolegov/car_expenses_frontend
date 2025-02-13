import {
    baseURL,
    getRequest,
    postRequest,
    putRequest,
} from '@/api/basic_api.js';

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
 * @param {Date} date
 * @returns {Promise<HistoryRecord>}
 */
export async function fetchBeforeDate(carId, date) {
    return await getRequest(`${baseURL}/history_records/before_date`, {
        car_id: carId,
        date: date.toISOString(),
    });
}