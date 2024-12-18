export interface FuelExpense {
    id: number;
    date: string;
    car_id: number;
    fuel_type: FuelType;
    liters: number;
    fuel_price: number; // per liter
    total: number;
    full_tank: boolean;
    currency: string;
    mileage: number;
    description?: string;
    user_id: number;
}