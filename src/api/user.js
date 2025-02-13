/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {Object} user
 */
import { baseURL, getRequest } from '@/api/basic_api.js';

export async function fetchMe() {
    return await getRequest(`${baseURL}/users/me`);
}

export async function fetchUserCars() {
    return await getRequest(`${baseURL}/cars`);
}
