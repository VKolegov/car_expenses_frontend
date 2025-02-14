<script setup>
import { computed } from 'vue';

import { useUserStore } from '@/store.js';
import SelectorWithIcon from '@/components/SelectorWithIcon.vue';

const store = useUserStore();
const model = defineModel({
  default: null,
});

const cars = computed(() => store.userCars);
</script>

<template>
  <selector-with-icon
      v-model="model"
      label="Автомобиль"
      :items="cars"
      :item-title="car => `${car.model} ${car.generation_info ? car.generation_info.short_name : ''}`"
      :icon-url-resolver="car => car.brand_info.logo_image"
  />
</template>

<style scoped>
</style>