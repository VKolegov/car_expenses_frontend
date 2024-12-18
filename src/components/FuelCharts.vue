<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {round} from "lodash";
import {VSelect, VSparkline} from "vuetify/components";

import {useUserStore} from "@/store.js";
import {fetchFuelExpensesHistory} from "@/api.js";

const store = useUserStore();
const cars = computed(() => store.userCars);

const selectedCar = ref(null);

onMounted(async () => {
  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

/** @type {import('vue').Ref<FuelExpense[]>} */
const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory(selectedCar.value.id);
});


// --------------

// Группировка всех данных по месяцам
/**
 *
 * @param {FuelExpense[]} data
 * @returns {{}}
 */
const groupByMonth = (data) => {
  const grouped = {};
  data.reverse().forEach(item => {
    const date = new Date(item.date);
    const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(item);
  });
  return grouped;
};

const expensesByMonth = ref([]);
const pricePerLiterByMonth = ref([]);
const mileageByMonth = ref([]);
const litersByMonth = ref([]);

watch(fuelExpensesHistory, newVal => {

  // Группировка всех данных
  const groupedData = groupByMonth(fuelExpensesHistory.value);
  const groups = Object.values(groupedData);

// Генерация массивов из сгруппированных данных
  expensesByMonth.value = groups.map(items =>
      items.reduce((sum, item) => sum + round(item.total), 0)
  ).map(v => round(v, 2));

  const months = Object.keys(groupedData);
  mileageByMonth.value = months.map((month, index) => {
    const currentMonthData = groupedData[month];
    const lastMileageCurrentMonth = currentMonthData[currentMonthData.length - 1].mileage;

    // Для первого месяца нет предыдущего месяца
    if (index === 0) {
      return lastMileageCurrentMonth - selectedCar.value.mileage;
    }

    const previousMonthData = groupedData[months[index - 1]];
    const lastMileagePreviousMonth = previousMonthData[previousMonthData.length - 1].mileage;

    return lastMileageCurrentMonth - lastMileagePreviousMonth;
  });

  litersByMonth.value = groups.map(items =>
      items.reduce((sum, item) => sum + item.liters, 0)
  ).map(v => round(v, 2));

  pricePerLiterByMonth.value = groups.map(items => {
    const totalLiters = items.reduce((sum, item) => sum + item.liters, 0);
    const totalCost = items.reduce((sum, item) => sum + item.total, 0);
    return round(totalCost / totalLiters, 2);
  });

// Вывод результатов
  console.log(groupedData);
});


const gradient = ['red', 'orange', 'yellow', 'green'];
const barWidth = 10;
const lineWidth = 3;
</script>

<template>
  <v-select
      v-model="selectedCar"
      return-object
      label="Select car to view history"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>


  <h2>Expenses by month</h2>
  <v-sparkline
      v-if="selectedCar && expensesByMonth"
      :model-value="expensesByMonth"
      :line-width="barWidth"
      :gradient="gradient"
      type="bar"
      auto-draw
      show-labels
  ></v-sparkline>

  <h2>Mileage by month</h2>
  <v-sparkline
      v-if="selectedCar && mileageByMonth"
      :model-value="mileageByMonth"
      :line-width="lineWidth"
      type="trend"
      :gradient="gradient"
      smooth
      auto-draw
      show-labels
  ></v-sparkline>

  <h2>Liters per month</h2>
  <v-sparkline
      v-if="selectedCar && litersByMonth"
      :model-value="litersByMonth"
      :line-width="lineWidth"
      type="trend"
      :gradient="gradient"
      smooth
      auto-draw
      show-labels
  ></v-sparkline>

  <h2>Price per liter by month</h2>
  <v-sparkline
      v-if="selectedCar && pricePerLiterByMonth"
      :model-value="pricePerLiterByMonth"
      :line-width="lineWidth"
      type="trend"
      :gradient="gradient"
      smooth
      auto-draw
      show-labels
  ></v-sparkline>
</template>

<style scoped>

</style>