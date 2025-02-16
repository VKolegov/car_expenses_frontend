import { omit, pick } from 'lodash';
import { ENGINE_TYPE } from '@/constants/engine_type.js';

export const FUEL_TYPES = {
    GASOLINE_80: {
        title: '80', value: 'gasoline-80',
    },
    GASOLINE_92: {
        title: '92', value: 'gasoline-92',
    },
    GASOLINE_95: {
        title: '95', value: 'gasoline-95',
    },
    GASOLINE_95_PLUS: {
        title: '95+', value: 'gasoline-95+',
    },
    GASOLINE_98: {
        title: '98', value: 'gasoline-98',
    },
    GASOLINE_100: {
        title: '100', value: 'gasoline-100',
    },
    DIESEL: {
        title: 'Дизель', value: 'diesel',
    },
};

export const FUEL_TYPES_MAP = {
    'gasoline-80': FUEL_TYPES.GASOLINE_80,
    'gasoline-92': FUEL_TYPES.GASOLINE_92,
    'gasoline-95': FUEL_TYPES.GASOLINE_95,
    'gasoline-95+': FUEL_TYPES.GASOLINE_95_PLUS,
    'gasoline-98': FUEL_TYPES.GASOLINE_98,
    'gasoline-100': FUEL_TYPES.GASOLINE_100,
    'diesel': FUEL_TYPES.DIESEL,
};

export function getFuelTypesByEngineType(engineType) {
    switch (engineType) {
        case ENGINE_TYPE.PETROL:
        case ENGINE_TYPE.GAS_PETROL:
        case ENGINE_TYPE.HYBRID:
            return omit(FUEL_TYPES, 'DIESEL');
        case ENGINE_TYPE.DIESEL:
            return pick(FUEL_TYPES, 'DIESEL');
        case ENGINE_TYPE.ELECTRO:
            return {}; // TODO
        case ENGINE_TYPE.GAS:
            return {}; // TODO
        default:
            return FUEL_TYPES;
    }
}