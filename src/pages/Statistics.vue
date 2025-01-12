<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store.js';
import { fetchCarStats } from '@/api.js';
import { VSelect, VTable } from 'vuetify/components';
import { formatCurrency, formatDistance, formatDateTime, formatFuel } from '../formatting.js';

const store = useUserStore();

const cars = computed(() => store.userCars);
const selectedCar = ref(null);

onMounted(async () => {
  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

/** @type {import('vue').Ref<TotalCarStats>} */
const stats = ref(null);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  stats.value = await fetchCarStats(selectedCar.value.id);
});
</script>

<template>
  <h1>Статистика (WIP)</h1>

  <v-select
      v-model="selectedCar"
      return-object
      label="Автомобиль"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>

  <v-table v-if="stats" density="compact">
    <thead>
    <tr>
      <th class="text-left">Параметр</th>
      <th class="text-left">Значение</th>
    </tr>
    </thead>
    <tbody>
    <!-- Финансы -->
    <tr>
      <td colspan="2" class="font-weight-bold">Главное</td>
    </tr>

    <tr>
      <td>Текущий пробег</td>
      <td>{{ formatDistance(stats.latest_mileage) }}</td>
    </tr>
    <tr>
      <td>Время владения</td>
      <td>{{ stats.days_owned }} дней</td>
    </tr>
    <tr>
      <td>Пробег за время владения</td>
      <td>{{ formatDistance(stats.total_mileage) }}</td>
    </tr>
    <tr>
      <td>Последний расход топлива</td>
      <td>{{ stats.last_consumption }} {{ stats.consumption_units }}</td>
    </tr>
    <tr>
      <td>Средний расход топлива</td>
      <td>{{ stats.average_consumption }} {{ stats.consumption_units }}</td>
    </tr>
    <tr>
      <td>Общая сумма затрат</td>
      <td>{{ formatCurrency(stats.total_money) }}</td>
    </tr>
    <tr>
      <td>Траты на топливо</td>
      <td>{{ formatCurrency(stats.total_fuel_money) }}</td>
    </tr>
    <tr>
      <td>Траты на ремонт</td>
      <td>{{ formatCurrency(stats.total_repair_money) }}</td>
    </tr>
    <tr>
      <td>Траты на обслуживание</td>
      <td>{{ formatCurrency(stats.total_maintenance_money) }}</td>
    </tr>
    <tr>
      <td>Траты на шиномонтаж</td>
      <td>{{ formatCurrency(stats.total_wheels_money) }}</td>
    </tr>
    <tr>
      <td>Средние затраты в день</td>
      <td>{{ formatCurrency(stats.money_per_day) }}</td>
    </tr>
    <tr>
      <td>Средний пробег в день</td>
      <td>{{ formatDistance(stats.km_per_day) }}</td>
    </tr>
    <tr>
      <td>Средние затраты на километр</td>
      <td>{{ formatCurrency(stats.money_per_km) }}</td>
    </tr>

    <!-- Заправки -->
    <tr>
      <td colspan="2" class="font-weight-bold">Топливо</td>
    </tr>
    <tr>
      <td>Общее количество литров</td>
      <td>{{ formatFuel(stats.total_liters) }}</td>
    </tr>
    <tr>
      <td>Количество полных заправок</td>
      <td>{{ stats.total_full_refills }}</td>
    </tr>
    <tr>
      <td>Средний расход топлива в день</td>
      <td>{{ formatFuel(stats.liters_per_day) }}</td>
    </tr>
<!--    <tr>-->
<!--      <td>Средний объем полной заправки</td>-->
<!--      <td>{{ formatFuel(stats.average_full_refill_volume) }}</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>Средняя стоимость полной заправки</td>-->
<!--      <td>{{ formatCurrency(stats.average_full_refill_cost) }}</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>Средний пробег между полными заправками</td>-->
<!--      <td>{{ formatDistance(stats.average_full_refill_mileage) }}</td>-->
<!--    </tr>-->

    </tbody>
  </v-table>

</template>

<style scoped>

</style>