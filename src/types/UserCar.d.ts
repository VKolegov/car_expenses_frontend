import {CarBrand} from "@/types/CarBrand";
import {CarBrandModel} from "@/types/CarBrandModel";
import {CarModelGeneration} from "@/types/CarModelGeneration";
import {CarGenerationModification} from "@/types/CarGenerationModification";

export interface UserCar {
    id: number;
    user_id: number;
    brand: string;
    brand_info: CarBrand;
    model: string;
    model_info: CarBrandModel;
    generation_info?: CarModelGeneration;
    modification_info?: CarGenerationModification;
    vin?: string;
    chassis_number?: string;
    registration_number?: string;
    year_of_manufacture: number;
    color: string;
    mileage: number;
    added_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
