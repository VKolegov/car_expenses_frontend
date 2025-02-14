/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 */
import { baseURL, getRequest, postRequest } from '@/api/basic_api.js';

export async function fetchMe() {
    return await getRequest(`${baseURL}/users/me`);
}

/**
 *
 * @returns {Promise<UserCar[]>}
 */
export async function fetchUserCars() {
    return await getRequest(`${baseURL}/cars`);
}

/**
 * @param {Object} carData TODO type
 * @returns {Promise<UserCar>}
 */
export async function createUserCar(carData) {
    return await postRequest(`${baseURL}/cars`, carData);
}