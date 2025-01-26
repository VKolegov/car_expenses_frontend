<script setup>
import { VDataTable } from 'vuetify/components';
import { FUEL_TYPES_MAP } from '@/constants/fuel.js';
import { formatCurrency, formatDistance, formatFuel } from '@/formatting.js';
import { ref } from 'vue';

/** @type {import('vue').Ref<HistoryRecord[]>} */
const fuelExpensesHistory = ref([]);

const headers = [
  {
    title: 'Date',
    key: 'date',
    value: item => new Date(item.date).toLocaleString(),
  },
  {
    title: 'Fuel type',
    key: 'fuel_type',
    value: item => FUEL_TYPES_MAP[item.type_data.fuel_type].title,
  },
  {
    title: 'Refill volume, l',
    key: 'liters',
    value: item => formatFuel(item.type_data.liters),
  },
  {
    title: 'Refill mileage, km',
    key: 'mileage',
    value: item => formatDistance(item.mileage),
  },
  {
    title: 'Fuel price',
    key: 'fuel_price',
    value: item => formatCurrency(item.type_data.fuel_price),
  },
  {
    title: 'Total',
    key: 'total',
    value: item => formatCurrency(item.type_data.total),
  },
  {
    title: 'Full tank',
    key: 'full_tank',
    value: item => item.type_data.full_tank ? 'Yes' : 'No',
  },
];
</script>

<template>
  <v-data-table
      :items="fuelExpensesHistory"
      :headers="headers"
      density="compact"
  ></v-data-table>
</template>

<style scoped>

</style>