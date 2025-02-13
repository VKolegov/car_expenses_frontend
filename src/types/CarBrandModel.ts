export interface CarBrandModel {
    id: number;
    brand_id: number;
    name: string;
    short_name: string;
    start_year: number;
    end_year?: number;
    sort_position: number;
}