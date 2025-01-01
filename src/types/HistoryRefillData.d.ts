import {FuelType} from "./enums/FuelType";

export interface HistoryRefillData {
    fuel_type: FuelType;
    liters: number;
    fuel_price: number; // per liter
    total: number;
    full_tank: boolean;
}