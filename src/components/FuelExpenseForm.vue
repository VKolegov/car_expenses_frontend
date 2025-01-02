<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store.js';

import { VSelect, VSwitch } from 'vuetify/components';
import { ru } from 'date-fns/locale';

import { createFuelExpense, fetchFuelExpensesHistory, updateFuelExpense } from '@/api.js';
import { FUEL_TYPES } from '@/constants/fuel.js';

const store = useUserStore();
const router = useRouter();

const props = defineProps({
  /** @type {HistoryRecord<HistoryRefillData>} */
  record: {
    type: Object,
    default: null,
  },
});

/** @type {import('vue').Ref<HistoryRecord<HistoryRefillData>[]>} */
const fuelExpensesHistory = ref([]);

const cars = computed(() => store.userCars);
const selectedCar = ref(null);

onMounted(async () => {
  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

const mileage = ref(0);
const fuel = ref(null);
const liters = ref(0);
const cost = ref(0);
const fullTank = ref(false);
/** @type {import('vue').Ref<Date>} */
const date = ref(new Date());

const description = ref('');

onMounted(() => {
  if (props.record) {
    setData(props.record);
  }
});

// for router
/**
 * @param {HistoryRecord<HistoryRefillData>} historyRecord
 */
function setData (historyRecord) {
  // TODO: select car id
  mileage.value = historyRecord.mileage;
  fuel.value = historyRecord.type_data.fuel_type;
  liters.value = historyRecord.type_data.liters;
  cost.value = historyRecord.type_data.total;
  fullTank.value = historyRecord.type_data.full_tank === 1;

  date.value = new Date(historyRecord.date);
}

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  if (props.record) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory(selectedCar.value.id);

  if (fuelExpensesHistory.value.length > 0) {
    mileage.value = fuelExpensesHistory.value[0].mileage;
  }
});

const canBeSaved = computed(() => {
  return selectedCar.value
      && date.value
      && fuel.value
      && liters.value > 0
      && cost.value > 0
      && mileage.value > 0; // TODO
});

const errors = ref(new Map());

function onSaveClick () {
  const data = {
    car_id: selectedCar.value.id,
    date: date.value.getTime(),
    fuel_type: fuel.value,
    liters: liters.value,
    fuel_price: cost.value / liters.value,
    total: cost.value,
    full_tank: fullTank.value ? 1 : 0,
    currency: 'rub',
    mileage: mileage.value,
    description: description.value,
  };

  const update = Boolean(props.record);

  let promise;

  errors.value.clear();

  if (update) {
    promise = updateFuelExpense(props.record.id, data);
  } else {
    promise = createFuelExpense(data);
  }

  promise.then(fuelExpense => {
    fuelExpensesHistory.value.push(fuelExpense);

    store.displayNotification(
        `History record ${update ? 'updated' : 'added'}!`,
        'success'
    );

    router.push({ name: 'refills' });
  }).catch(error => {

    if (!error.responseBody) {
      store.displayNotification('Error!', 'error');
    } else {
      errors.value = error.getFieldErrors();

      store.displayNotification(
          error.getErrorsAsText(),
          'error'
      );
    }
  });
}

</script>

<template>
  <v-form @submit.prevent style="width: 100%;">
    <h1>{{ record ? 'Editing fuel expense' : 'Adding fuel expense' }}</h1>
    <v-select
        v-model="selectedCar"
        return-object
        label="Select car to add fuel expense"
        :items="cars"
        :item-title="car => `${car.brand} ${car.model}`"
    ></v-select>

    <vue-date-picker
        v-model="date"
        locale="ru-RU"
        format="dd/MM/yyyy HH:mm"
        :format-locale="ru"
        style="margin-bottom: 20px"
    ></vue-date-picker>


    <v-text-field
        v-if="selectedCar"
        v-model="mileage"
        type="number"
        label="Enter current mileage"
        :error-messages="errors.get('mileage')"
    ></v-text-field>

    <v-row>
      <v-col>
        <v-select
            v-if="selectedCar"
            v-model="fuel"
            :items="Object.values(FUEL_TYPES)"
            item-title="title"
            item-value="value"
            label="Select fuel type"
        />
      </v-col>

      <v-col>
        <v-text-field
            v-if="selectedCar"
            v-model="liters"
            type="number"
            label="Enter liters"
            :error-messages="errors.get('liters')"
        ></v-text-field>
      </v-col>
    </v-row>


    <v-switch
        v-if="selectedCar"
        v-model="fullTank"
        label="Full tank"
    ></v-switch>

    <v-text-field
        v-if="selectedCar"
        v-model="cost"
        type="number"
        label="Enter cost"
        :error-messages="errors.get('cost')"
    ></v-text-field>

    <v-btn
        v-if="selectedCar"
        @click="onSaveClick"
        :disabled="!canBeSaved"
    >Save
    </v-btn>

  </v-form>
</template>

<style scoped>

</style>