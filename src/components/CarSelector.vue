<script setup>
import { computed, onMounted, ref } from 'vue';
import { VSelect, VListItem } from 'vuetify/components';

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
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <img
              :src="item.raw.brand_info.logo_image"
              class="car-list-item__brand-logo"
          >
        </template>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item, index }">
      <div style="display: flex; align-items: center;">
        <img
            :src="item.raw.brand_info.logo_image"
            class="car-list-item__brand-logo"
        >
        <span>{{ `${item.raw.model} ${item.raw.generation_info.short_name}` }}</span>
      </div>
    </template>
  </v-select>
</template>

<style scoped>
.car-list-item__brand-logo {
  margin-right: 5px;
  width: 16px;
  height: 16px;
}
</style>