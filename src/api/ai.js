import { baseURL, postRequest } from '@/api/basic_api.js';

/**
 *
 * @param {string[]} items
 * @returns {Promise<{response: string, cost: number}>}
 */
export async function getAiItemsDescription(items) {
    return await postRequest(`${baseURL}/ai/invoice_items_description`,
        { items });
}