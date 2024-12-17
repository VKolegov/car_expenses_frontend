<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useDate} from "vuetify";

import {VSelect, VSwitch, VDatePicker} from "vuetify/components";
import {VTimePicker} from 'vuetify/labs/VTimePicker'

import {createFuelExpense, fetchCars, fetchFuelExpensesHistory} from "@/api.js";
import {FUEL_TYPES} from "@/constants/fuel.js";

/** @type {import('vue').Ref<FuelExpense[]>} */
const fuelExpensesHistory = ref([]);

const cars = ref([]);
const selectedCar = ref(null);

onMounted(async () => {
  cars.value = await fetchCars();

  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
})


const mileage = ref(0);
const fuel = ref(null);
const liters = ref(0);
const cost = ref(0);
const fullTank = ref(false);
const date = ref(new Date());
const time = ref('10:00');
const description = ref('');

const datetime = computed(() => {
  const dateStr = adapter.format(date.value, 'keyboardDate');
  return new Date(`${dateStr} ${time.value}`);
});

watch(selectedCar, async (newValue) => {
  if (!newValue) {
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
      && mileage.value > 0 // TODO
});


const adapter = useDate();

function onSaveClick() {
  const data = {
    car_id: selectedCar.value.id,
    date: datetime.value,
    fuel_type: fuel.value,
    liters: liters.value,
    fuel_price: cost.value / liters.value,
    total: cost.value,
    full_tank: fullTank.value ? '1' : '0',
    currency: 'rub',
    mileage: mileage.value,
    description: description.value,
  };

  createFuelExpense(data).then(fuelExpense => {
    fuelExpensesHistory.value.push(fuelExpense);

    alert('Fuel expense added!');
  });
}

</script>

<template>
  <v-form @submit.prevent style="width: 100%;">
    <h1>Adding fuel expense</h1>
    <v-select
        v-model="selectedCar"
        return-object
        label="Select car to add fuel expense"
        :items="cars"
        :item-title="car => `${car.brand} ${car.model}`"
    ></v-select>

    <v-text-field
        v-if="selectedCar"
        v-model="mileage"
        type="number"
        label="Enter current mileage"
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
    ></v-text-field>

    <v-date-picker
        v-if="selectedCar"
        v-model="date"
    ></v-date-picker>

    <v-time-picker
        v-if="selectedCar"
        v-model="time"
    ></v-time-picker>

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