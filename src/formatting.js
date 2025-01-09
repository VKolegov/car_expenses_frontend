import { format } from 'date-fns';
import { ru } from "date-fns/locale";
import { CURRENCY_SYMBOLS } from '@/constants/currency.js';

export const numberFormatter = Intl.NumberFormat();

export const currencyFormatter = (value) => numberFormatter.format(value) + ' ' + CURRENCY_SYMBOLS['rub'];
export const distanceFormatter = (value) => numberFormatter.format(value) + ' км';
export const fuelFormatter = (value) => numberFormatter.format(value) + ' л';

export const formatDateTime = (value) => format(value, 'dd/MM/yyyy HH:mm', { locale: ru });
export const formatDate = (value) => format(value, 'dd MMM', { locale: ru });
export const formatTime = (value) => format(value, 'HH:mm', { locale: ru });