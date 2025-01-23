import storageHelper, { TOKEN_KEY } from '@/local_storage.js';
import HttpError from '@/errors.js';

export const baseURL = import.meta.env.VITE_API_URL;
export const baseURL_GO = import.meta.env.VITE_GO_API_URL;

const basicHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export async function makeRequest (method, url, data) {

    const isGetRequest = method === 'GET';

    if (isGetRequest && data) {
        url = url + '?' + (new URLSearchParams(data)).toString();
    }

    const headers = basicHeaders;

    let token = storageHelper.get(TOKEN_KEY);

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const request = new Request(url, {
        method: method,
        body: !isGetRequest && data ? JSON.stringify(data) : null,
        headers: headers,
    });

    const response = await fetch(request);

    if (response.status <= 300) {
        return await response.json();
    }

    // Попробуем прочитать тело ответа (если доступно)
    let errorDetails = null;
    let responseBody = null;

    try {
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            responseBody = await response.json();
        } else {
            errorDetails = await response.text();
        }
    } catch (error) {
        console.error("Ошибка обработки ответа:", error);
    }

    throw new HttpError(response.status, url, response.statusText, errorDetails, responseBody);
}

export async function getRequest (url, params) {
    return await makeRequest('GET', url, params);
}

export async function postRequest (url, data) {
    return await makeRequest('POST', url, data);
}

export async function patchRequest (url, data) {
    return await makeRequest('PATCH', url, data);
}