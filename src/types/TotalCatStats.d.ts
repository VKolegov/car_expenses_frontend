export interface TotalCarStats {
    car_id: number;
    total_money: number;
    total_fuel_money: number;
    total_repair_money: number;
    total_maintenance_money: number;
    total_wheels_money: number;
    total_liters: number;
    total_full_refills: number;
    latest_full_refill_date: Date;
    last_consumption: number | null;
    average_consumption: number | null;
    average_full_refill_volume: number | null;
    average_full_refill_cost: number | null;
    average_full_refill_mileage: number | null;
    consumption_units: string;
    total_mileage: number;
    latest_mileage: number;
    days_owned: number;
    km_per_day: number;
    money_per_day: number;
    liters_per_day: number;
    money_per_km: number;
}