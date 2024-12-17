<script setup>
import {onMounted, ref, watch} from "vue";

import {VSelect, VDataTable} from "vuetify/components";

import {fetchCars, fetchFuelExpensesHistory} from "@/api.js";
import {FUEL_TYPES_MAP} from "@/constants/fuel.js";
import {CURRENCY_SYMBOLS} from "@/constants/currency.js";

const cars = ref([]);
const selectedCar = ref(null);

onMounted(async () => {
  cars.value = await fetchCars();

  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory();
});

const headers = [
  {
    title: 'Date',
    key: 'date',
    value: item => new Date(item.date).toLocaleString(),
  },
  {
    title: 'Fuel type',
    key: 'fuel_type',
    value: item => FUEL_TYPES_MAP[item.fuel_type].title,
  },
  {
    title: 'Refill volume, l',
    key: 'liters',
  },
  {
    title: 'Refill mileage, km',
    key: 'mileage'
  },
  {
    title: 'Fuel price',
    key: 'fuel_price',
    value: item => item.fuel_price + ' ' + CURRENCY_SYMBOLS[item.currency],
  },
  {
    title: 'Total',
    key: 'total',
    value: item => item.total + ' ' + CURRENCY_SYMBOLS[item.currency],
  },
  {
    title: 'Full tank',
    key: 'full_tank',
    value: item => item.full_tank === 1 ? 'Yes' : 'No',
  }
];
</script>

<template>
<h1>WIP</h1>

  <v-select
      v-model="selectedCar"
      return-object
      label="Select car to view history"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>

  <v-data-table
      v-if="selectedCar"
      :items="fuelExpensesHistory"
      :headers="headers"
  ></v-data-table>
</template>

<style scoped>

</style>