<script setup>
import { computed, onMounted, ref } from 'vue';
import { VSelect } from 'vuetify/components';

import { useUserStore } from '@/store.js';

const store = useUserStore();
const model = defineModel({
  default: null
});

const cars = computed(() => store.userCars);
onMounted(async () => {
  if (cars.value.length === 1) {
    model.value = cars.value[0];
  }
});
</script>

<template>
  <v-select
      v-model="model"
      return-object
      label="Автомобиль"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model} ${car.generation_info.short_name}`"
  ></v-select>
</template>

<style scoped>

</style>