<script setup>
import { computed } from 'vue';

import { useUserStore } from '@/store.js';
import SelectorWithIcon from '@/components/SelectorWithIcon.vue';

const store = useUserStore();

const cars = computed(() => store.userCars);

const selectedCar = computed(() => store.selectedCar);

function onCarSelected(car) {
  store.setSelectedCar(car);
}

</script>

<template>
  <selector-with-icon
      :model-value="selectedCar"
      @update:model-value="onCarSelected"
      label="Автомобиль"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model} ${car.year_of_manufacture} г.`"
      :icon-url-resolver="car => car.brand_info.logo_image"
      auto-select-first
  />
</template>

<style scoped>
</style>