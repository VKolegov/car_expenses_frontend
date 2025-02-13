import { baseURL, getRequest } from '@/api/basic_api.js';

export async function fetchCarBrands() {
    return await getRequest(`${baseURL}/db/car_brands`);
}

export async function fetchBrandModels(brandId) {
    return await getRequest(`${baseURL}/db/car_brands/${brandId}/models`);
}

export async function fetchModelGenerations(modelId) {
    return await getRequest(`${baseURL}/db/car_models/${modelId}/generations`);
}

export async function fetchGenerationModifications(generationId) {
    return await getRequest(`${baseURL}/db/car_generations/${generationId}/modifications`);
}