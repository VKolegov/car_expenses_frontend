import {
    mdiBank,
    mdiCarClock,
    mdiTire,
    mdiCarTurbocharger,
    mdiCarWash,
    mdiCarWrench,
    mdiGasStation,
    mdiParking,
    mdiShovel,
} from '@mdi/js';

export const HISTORY_RECORD_CATEGORY = {
    REFILL: { title: 'Заправка', value: 'refill', icon: mdiGasStation },
    MAINTENANCE: {
        title: 'Обслуживание',
        value: 'maintenance',
        icon: mdiCarClock,
    },
    REPAIR: { title: 'Ремонт', value: 'repair', icon: mdiCarWrench },
    WHEELS: { title: 'Шиномонтаж', value: 'wheels', icon: mdiTire },
    CAR_WASH: { title: 'Мойка', value: 'car_wash', icon: mdiCarWash },
    PARKING: { title: 'Парковка', value: 'parking', icon: mdiParking },
    TAXES_AND_INSURANCE: {
        title: 'Налоги и страховка',
        value: 'taxes_and_insurance',
        icon: mdiBank,
    },
    ACCESSORIES: { title: 'Аксессуары', value: 'accessories', icon: mdiShovel },
    TUNING: { title: 'Тюнинг', value: 'tuning', icon: mdiCarTurbocharger },
};

export const HISTORY_RECORD_CATEGORY_MAP = {
    'refill': HISTORY_RECORD_CATEGORY.REFILL,
    'maintenance': HISTORY_RECORD_CATEGORY.MAINTENANCE,
    'repair': HISTORY_RECORD_CATEGORY.REPAIR,
    'wheels': HISTORY_RECORD_CATEGORY.WHEELS,
    'car_wash': HISTORY_RECORD_CATEGORY.CAR_WASH,
    'parking': HISTORY_RECORD_CATEGORY.PARKING,
    'taxes_and_insurance': HISTORY_RECORD_CATEGORY.TAXES_AND_INSURANCE,
    'accessories': HISTORY_RECORD_CATEGORY.ACCESSORIES,
    'tuning': HISTORY_RECORD_CATEGORY.TUNING,
};