import {baseURL, getRequest, postRequest} from "@/basic_api.js";

/**
 *
 * @param phone
 * @param password
 * @returns {Promise<{user: Object, token: string}>}
 */
export async function login(phone, password) {
    const r = await postRequest(`${baseURL}/login`, {
        phone,
        password
    });

    return r;
}

export async function me() {
    return await getRequest(`${baseURL}/me`);
}

export async function fetchCars(){
    const r = await getRequest(`${baseURL}/cars`);

    return r;
}

export async function fetchFuelExpensesHistory() {
    return await getRequest(`${baseURL}/fuel_expenses`);
}

export async function createFuelExpense(data) {
    return await postRequest(`${baseURL}/fuel_expenses`, data);
}