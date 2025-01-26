import {Currency} from "./enums/Currency";
import {HistoryRecordExpenseCategory} from "./enums/HistoryRecordExpenseCategory";
import {InvoiceItem} from "./InvoiceItem";
import {HistoryRefillData} from "./HistoryRefillData";

export interface HistoryRecord {
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

    type_data?: HistoryRefillData

    invoice_items?: InvoiceItem[],
}