import {EngineType} from "@/types/enums/EngineType";
import {Drivetrain} from "@/types/enums/Drivetrain";
import {TransmissionType} from "@/types/enums/TransmissionType";
import {FuelType} from "@/types/enums/FuelType";

export interface CarGenerationModification {
    id: number;
    brand_id: number;
    model_id: number;
    generation_id: number;
    name: string;
    start_year: number;
    end_year: number;
    engine_type?: EngineType;
    engine_model?: string;
    engine_horsepower?: number;
    engine_torque?: number;
    engine_horsepower_rpm?: string;
    engine_displacement?: number; // cm3
    drivetrain?: Drivetrain;
    transmission_type?: TransmissionType;
    acceleration_to_100_kmh?: number;
    fuel_type?: FuelType;
    fuel_tank_volume?: number;
    fuel_consumption_city?: number;
    fuel_consumption_highway?: number;
    sort_position: number;
}