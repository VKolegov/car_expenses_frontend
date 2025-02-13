<script setup>
import { VSelect, VAutocomplete } from 'vuetify/components';
import { onMounted, ref, watch } from 'vue';
import { fetchBrandModels, fetchCarBrands, fetchGenerationModifications, fetchModelGenerations } from '@/api/db.js';
import BrandSelector from '@/components/BrandSelector.vue';

const props = defineProps({
  /** @type {UserCar} */
  car: {
    type: Object,
    default: null,
  },
});

const brand = ref(null);
const brands = ref([]);

fetchCarBrands().then(r => brands.value = r);

const model = ref(null);
const models = ref([]);
watch(brand, (selectedBrand) => {
  if (!selectedBrand) {
    return;
  }

  fetchBrandModels(selectedBrand.id).then(r => models.value = r);
});

const generation = ref(null);
const generations = ref([]);
watch(model, (selectedModel) => {
  if (!selectedModel) {
    return;
  }

  fetchModelGenerations(selectedModel.id).then(r => generations.value = r);
});

const modification = ref(null);
const modifications = ref([]);

watch(generation, (selectedGeneration) => {
  if (!selectedGeneration) {
    return;
  }

  fetchGenerationModifications(selectedGeneration.id).then(r => modifications.value = r);
});

</script>

<template>
  <h1>{{ car ? 'Редактирование автомобиля' : 'Новый автомобиль' }}</h1>


  <brand-selector
      v-model="brand"
      :brands="brands"
  />

  <v-autocomplete
      v-model="model"
      :items="models"
      label="Модель"
      return-object
      :disabled="car !== null"
      :item-title="m => m.short_name"
  />

  <v-autocomplete
      v-if="model"
      v-model="generation"
      :items="generations"
      label="Поколение"
      return-object
      :item-title="g => g.short_name"
  />

  <v-autocomplete
      v-if="generation"
      v-model="modification"
      :items="modifications"
      label="Модификация"
      return-object
      :item-title="m => `${m.name} ${m.engine_type}`"
  />

</template>

<style scoped>

</style>