<script setup>
import {onMounted, ref, watch} from "vue";
import {fetchCars, fetchFuelExpensesHistory} from "@/api.js";

const cars = ref([]);
const selectedCar = ref(null);

onMounted(async () => {
  cars.value = await fetchCars();
})



const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory();
});
</script>

<template>
<h1>WIP</h1>

  <v-select
      v-model="selectedCar"
      return-object
      label="Select car to view stats"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>
</template>

<style scoped>

</style>