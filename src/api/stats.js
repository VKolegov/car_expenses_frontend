import { baseURL, getRequest } from '@/api/basic_api.js';

/**
 *
 * @param {number} carId
 * @returns {Promise<TotalCarStats>}
 */
export async function fetchCarStats(carId) {
    return await getRequest(`${baseURL}/stats/car/${carId}`);
}