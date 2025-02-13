import { baseURL, getRequest } from '@/api/basic_api.js';

/**
 *
 * @returns {Promise<CarBrand[]>}
 */
export async function fetchCarBrands() {
    return await getRequest(`${baseURL}/db/car_brands`);
}

/**
 *
 * @param {number} brandId
 * @returns {Promise<CarBrandModel[]>}
 */
export async function fetchBrandModels(brandId) {
    return await getRequest(`${baseURL}/db/car_brands/${brandId}/models`);
}

/**
 *
 * @param {number} modelId
 * @returns {Promise<CarModelGeneration[]>}
 */
export async function fetchModelGenerations(modelId) {
    return await getRequest(`${baseURL}/db/car_models/${modelId}/generations`);
}

/**
 *
 * @param {number} generationId
 * @returns {Promise<CarGenerationModification[]>}
 */
export async function fetchGenerationModifications(generationId) {
    return await getRequest(`${baseURL}/db/car_generations/${generationId}/modifications`);
}