import storageHelper, {TOKEN_KEY} from "@/local_storage.js";
import HttpError from "@/errors.js";

export const baseURL = 'https://car-expenses.vkolegov.ru/api';


const basicHeaders ={
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export async function makeRequest(method, url, data) {

    if (method === 'GET' && data) {
        url = url + (new URLSearchParams(data)).toString();
    }

    const headers = basicHeaders;

    let token = storageHelper.get(TOKEN_KEY);

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const request = new Request(url, {
        method: method,
        body: data ? JSON.stringify(data) : null,
        headers: headers,
    });

    const response = await fetch(request);

    if (response.status <= 300) {
        return await response.json();
    }

    throw new HttpError(`error: ${response.status}` + await response.text(), response.status);
}

export async function getRequest(url, params) {
    return await makeRequest('GET', url, params);
}

export async function postRequest(url, data) {
    return await makeRequest('POST', url, data);
}