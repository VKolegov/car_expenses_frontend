import {Currency} from "./enums/Currency";

export interface HistoryRecord<T> {
    id: number;
    date: Date | number;
    user_id: number;
    car_id: number;
    type: HistoryRecordType;
    category: HistoryRecordExpenseCategory;
    total: number;
    currency: Currency;
    mileage: number;
    description?: string;

    type_data?: T
}