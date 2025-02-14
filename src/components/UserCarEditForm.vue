<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { VAutocomplete, VLabel, VSelect } from 'vuetify/components';
import { mdiContentSave } from '@mdi/js';
import { ru } from 'date-fns/locale';

import { useUserStore } from '@/store.js';
import { fetchBrandModels, fetchCarBrands, fetchGenerationModifications, fetchModelGenerations } from '@/api/db.js';
import { createUserCar } from '@/api/user.js';
import HttpError from '@/errors.js';

import SelectorWithIcon from '@/components/SelectorWithIcon.vue';

const props = defineProps({
  /** @type {UserCar} */
  car: {
    type: Object,
    default: null,
  },
});

const router = useRouter();
const store = useUserStore();

/** @type { import('vue').Ref<CarBrand> } */
const brand = ref(null);
const brands = ref([]);

fetchCarBrands().then(r => brands.value = r);

/** @type { import('vue').Ref<CarBrandModel> } */

const model = ref(null);
const models = ref([]);
watch(brand, (selectedBrand) => {
  carData.value.brand_id = selectedBrand?.id;
  model.value = null;

  if (!selectedBrand) {
    return;
  }

  fetchBrandModels(selectedBrand.id).then(r => models.value = r);
});

/** @type { import('vue').Ref<CarModelGeneration> } */

const generation = ref(null);
const generations = ref([]);
watch(model, (selectedModel) => {
  carData.value.model_id = selectedModel?.id;
  generation.value = null;

  if (!selectedModel) {
    return;
  }

  fetchModelGenerations(selectedModel.id).then(r => generations.value = r);
});

/** @type { import('vue').Ref<CarGenerationModification> } */

const modification = ref(null);
const modifications = ref([]);

watch(generation, (selectedGeneration) => {
  modification.value = null;
  carData.value.generation_id = selectedGeneration?.id;

  if (!selectedGeneration) {
    return;
  }

  fetchGenerationModifications(selectedGeneration.id).then(r => modifications.value = r);
});

watch(modification, (selectedModification) => {
  carData.value.modification_id = selectedModification?.id;
});

const carData = ref({
  brand_id: null,
  model_id: null,
  generation_id: null,
  modification_id: null,
  vin: '',
  registration_number: null,
  year_of_manufacture: null,
  color: '',
  mileage: 0,
  purchased_at: new Date(),
});

// validation

const today = new Date();
const minYear = 1900;
const maxYear = today.getFullYear();
const maxMileage = 99_999_999;

const required = value => (value !== null && value !== '') || 'Обязательное поле';

const rules = {
  vin: [
    required,
    value => value.length >= 3 && value.length <= 17 || 'Некорректная длина',
    value => {
      let regex;
      if (value.length !== 17) {
        regex = /^[A-Z0-9\-]{3,16}$/;
        return regex.test(value) || 'Некорректный номер кузова';
      } else {
        regex = /^[A-HJ-NPR-Z0-9]{17}$/;
        return regex.test(value) || 'Некорректный VIN';
      }
    },
  ],
  brand: [
    required,
  ],
  model: [
    required,
  ],
  year: [
    required,
    value => {
      const gen = generation.value;

      if (gen) {
        const endYear = gen.end_year || maxYear;
        return (value <= endYear && value >= gen.start_year) || 'Не совпадает с поколением автомобиля';
      }

      return (value <= maxYear && value >= minYear) || 'Некорректное значение';
    },
  ],

  mileage: [
    required,
    value => value <= maxMileage || 'Некорретное значение',
  ],

  color: [
    required,
  ],
};

// submitting

const errors = ref(new Map());

/**
 *
 * @param {import('vuetify').SubmitEventPromise} e
 * @returns {Promise<void>}
 */
async function onSubmit(e) {
  const validationResult = await e;

  if (!validationResult.valid) {
    return;
  }

  const update = Boolean(props.car);

  let success = false;

  if (!props.car) {
    success = await addCar();
  }

  if (!success) {
    return;
  }

  store.displayNotification(
      `Car ${update ? 'updated' : 'added to garage'}!`,
      'success',
  );

  await router.push({ name: 'garage' });
}

async function addCar() {
  try {
    const newCar = await createUserCar(carData.value);
    store.addUserCar(newCar);
    return true;
  } catch (e) {
    await handleError(e);
  }

  return false;
}

async function handleError(e) {
  console.error(e);

  if (e instanceof HttpError && e.status === 422) {
    if (e.status === 422) {
      errors.value = e.getFieldErrors();
      store.displayNotification(
          e.getErrorsAsText(),
          'error',
      );
    } else {
      store.displayNotification(
          e.getError(),
          'error'
      );
    }
  }
}
</script>

<template>
  <v-form
      class="car-edit-form"
      @submit.prevent="onSubmit"
  >
    <h1>{{ car ? 'Редактирование автомобиля' : 'Новый автомобиль' }}</h1>

    <span>Скоро сделаем определение различной информации по VIN. Пока нужно заполнять все вручную</span>

    <!-- TODO: определять бренд и модель по VIN -->
    <v-text-field
        :model-value="carData.vin"
        @update:model-value="v => carData.vin = v.toUpperCase()"
        counter="17"
        maxlength="17"
        label="VIN / Номер кузова"
        :rules="rules.vin"
        :error-messages="errors.get('vin')"
    />


    <selector-with-icon
        v-model="brand"
        label="Бренд"
        :items="brands"
        :item-title="b => b.name"
        :icon-url-resolver="b => b.logo_image"
        autocomplete
        :rules="rules.brand"
        :error-messages="errors.get('brand_id')"
    />

    <v-autocomplete
        v-model="model"
        :items="models"
        label="Модель"
        return-object
        :disabled="car !== null"
        :item-title="m => m.short_name"
        :rules="rules.model"
        :error-messages="errors.get('model_id')"
    />

    <v-select
        v-if="model"
        v-model="generation"
        :items="generations"
        label="Поколение"
        return-object
        clearable
        :item-title="g => g.short_name"
        :error-messages="errors.get('generation_id')"
    />

    <v-select
        v-if="generation"
        v-model="modification"
        :items="modifications"
        label="Модификация"
        return-object
        clearable
        :item-title="m => `${m.name} ${m.engine_type}`"
        :error-messages="errors.get('modification_id')"
    />

    <!-- TODO: validate length -->
    <v-text-field
        v-model="carData.registration_number"
        label="Номер"
    />

    <!-- TODO: предполагать поколение по году выпуска -->
    <!-- TODO: вытаскивать из VIN -->
    <v-text-field
        v-model.number="carData.year_of_manufacture"
        label="Год выпуска"
        type="number"
        suffix="г"
        min="1900"
        :max="maxYear"
        :rules="rules.year"
        :error-messages="errors.get('year_of_manufacture')"
    />

    <v-text-field
        v-model.number="carData.mileage"
        label="Пробег при покупке"
        type="number"
        suffix="км"
        min="0"
        :max="maxMileage"
        :rules="rules.mileage"
        :error-messages="errors.get('mileage')"
    />

    <v-text-field
        v-model="carData.color"
        label="Цвет"
        type="text"
        maxlength="64"
        :rules="rules.color"
        :error-messages="errors.get('color')"
    />

    <vue-date-picker
        v-model="carData.purchased_at"
        locale="ru-RU"
        format="dd/MM/yyyy"
        :max-date="today"
        :enable-time-picker="false"
        :format-locale="ru"
        :error-messages="errors.get('purchased_at')"
    />

    <v-btn
        type="submit"
        :icon="mdiContentSave"
        color="primary"
        class="save-btn-mobile"
    ></v-btn>

    <v-btn
        type="submit"
        class="save-btn"
    >
      {{ car ? 'Сохранить' : 'Добавить' }}
    </v-btn>

  </v-form>

</template>

<style>
.save-btn {
  width: 100%;
}

.save-btn-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .save-btn {
    display: none;
  }

  .save-btn-mobile {
    display: block;
    bottom: 85px;
    right: 10px;
    position: fixed;
  }
}


</style>