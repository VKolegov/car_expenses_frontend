<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store.js';

import { VDataTable, VFab, VSelect } from 'vuetify/components';

import { fetchFuelExpensesHistory } from '@/api.js';
import { FUEL_TYPES_MAP } from '@/constants/fuel.js';
import { CURRENCY_SYMBOLS } from '@/constants/currency.js';
import { mdiPlus } from '@mdi/js';
import { round } from 'lodash';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();

const cars = computed(() => store.userCars);
const selectedCar = ref(null);

onMounted(async () => {
  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

/** @type {import('vue').Ref<HistoryRecord<HistoryRefillData>[]>} */
const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory(selectedCar.value.id);
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
    value: item => FUEL_TYPES_MAP[item.type_data.fuel_type].title,
  },
  {
    title: 'Refill volume, l',
    key: 'liters',
    value: item => item.type_data.liters,
  },
  {
    title: 'Refill mileage, km',
    key: 'mileage',
  },
  {
    title: 'Fuel price',
    key: 'fuel_price',
    value: item => round(item.type_data.fuel_price, 2) + ' ' + CURRENCY_SYMBOLS[item.currency],
  },
  {
    title: 'Total',
    key: 'total',
    value: item => round(item.type_data.total, 2) + ' ' + CURRENCY_SYMBOLS[item.currency],
  },
  {
    title: 'Full tank',
    key: 'full_tank',
    value: item => item.type_data.full_tank ? 'Yes' : 'No',
  },
];

function onClick(event, row) {
  console.log(row);
  router.push({
    name: 'edit_refill',
    params: {
      id: row.item.id,
    }
  });
}
</script>

<template>
  <h1>History records (WIP)</h1>

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
      density="compact"
      @click:row="onClick"
  ></v-data-table>

  <v-fab
      :icon="mdiPlus"
      :to="{name: 'add_refill'}"
      offset
      class="fixed"
  ></v-fab>
</template>

<style scoped>
.fixed {
  position: fixed;
  right: 55px;
  bottom: 105px;
}
</style>