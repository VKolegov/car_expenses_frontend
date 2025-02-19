export interface CarModelGeneration {
    id: number;
    brand_id: number;
    model_id: number;
    name: string;
    short_name: string;
    start_year: number;
    body_type: string;
    end_year?: number;
    sort_position: number;
}