export interface InvoiceItem {
    id?: number;
    name: string;
    cost: number;
    cost_formatted?: string;
    category: string;
    empty?: boolean;
}