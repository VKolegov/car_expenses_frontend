<script setup>
import { computed, ref, watch } from 'vue';
import { round } from 'lodash';
import { VCarousel, VCarouselItem } from 'vuetify/components';

/* chart.js */
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatCurrency, formatDistance, formatFuel } from '@/formatting.js';

import LineGradientChart from '@/components/charts/LineGradientChart.vue';
import BarGradientChart from '@/components/charts/BarGradientChart.vue';
import CarSelector from '@/components/CarSelector.vue';
import { fetchHistoryRecords } from '@/api/history_records.js';
import { useUserStore } from '@/store.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
);

/* end chart.js */

const store = useUserStore();

const selectedCar = computed(() => store.selectedCar);

/** @type {import('vue').Ref<HistoryRecord[]>} */
const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchHistoryRecords(selectedCar.value.id);
}, { immediate: true });

// --------------

// Группировка всех данных по месяцам
/**
 * Группирует массив записей истории по месяцам в обратном хронологическом порядке.
 *
 * @param {HistoryRecord[]} data - Массив записей истории, содержащих данные о заправках.
 * @returns {Object<string, HistoryRecord[]>} Объект, где ключи — это месяцы в формате "YYYY-MM",
 * а значения — массивы записей истории, относящиеся к этим месяцам.
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

const yLabels = ref([]);

watch(fuelExpensesHistory, newVal => {

  // Группировка всех данных
  const groupedData = groupByMonth(newVal);
  /** @type {Array<HistoryRecord[]>} */
  const groups = Object.values(groupedData);

// Генерация массивов из сгруппированных данных
  expensesByMonth.value = groups.map(items =>
      items.reduce((sum, item) => sum + round(item.total), 0),
  ).map(v => round(v, 2));

  const months = Object.keys(groupedData);
  yLabels.value = months;

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
      items.reduce((sum, item) => sum + (item.type_data?.liters ?? 0), 0),
  ).map(v => round(v, 2));

  pricePerLiterByMonth.value = groups.map(items => {
    const totalLiters = items.reduce((sum, item) => sum + (item.type_data?.liters ?? 0), 0);
    const totalCost = items.reduce((sum, item) => sum + (item.type_data?.total ?? 0), 0);
    return round(totalCost / totalLiters, 2);
  });

// Вывод результатов
  console.log(groupedData);
});

</script>

<template>
  <car-selector/>

  <v-carousel
      height="auto"
      :show-arrows="false"
      hide-delimiters
  >
    <v-carousel-item>
      <h2>Expenses by month</h2>
      <BarGradientChart
          v-if="expensesByMonth.length"
          title="Expenses per month"
          :y-values="expensesByMonth"
          :y-labels="yLabels"
          :tick-formatter="formatCurrency"
      />
      <h2>Mileage by month</h2>
      <LineGradientChart
          v-if="mileageByMonth.length"
          title="Mileage by month"
          :y-values="mileageByMonth"
          :y-labels="yLabels"
          :tick-formatter="formatDistance"
      />
      <h2>Liters per month</h2>
      <LineGradientChart
          v-if="litersByMonth.length"
          title="Liters per month"
          :y-values="litersByMonth"
          :y-labels="yLabels"
          :tick-formatter="formatFuel"
      />
    </v-carousel-item>
    <v-carousel-item>
      <h2>Price per liter by month</h2>
      <LineGradientChart
          v-if="pricePerLiterByMonth.length"
          title="Price per liter by month"
          :y-values="pricePerLiterByMonth"
          :y-labels="yLabels"
          :tick-formatter="formatCurrency"
      />
    </v-carousel-item>
  </v-carousel>

</template>

<style scoped>

</style>