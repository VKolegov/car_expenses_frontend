import { CURRENCY_SYMBOLS } from '@/constants/currency.js';

export const numberFormatter = Intl.NumberFormat();

export const currencyFormatter = (value) => numberFormatter.format(value) + ' ' + CURRENCY_SYMBOLS['rub'];
export const distanceFormatter = (value) => numberFormatter.format(value) + ' км';
export const fuelFormatter = (value) => numberFormatter.format(value) + ' л';