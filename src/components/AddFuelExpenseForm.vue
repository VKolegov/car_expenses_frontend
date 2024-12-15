<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {createFuelExpense, fetchCars, fetchFuelExpensesHistory} from "@/api.js";

import {VTimePicker} from 'vuetify/labs/VTimePicker'
import {useDate} from "vuetify";


const FUEL_TYPES = {
  GASOLINE_80: "gasoline-80",
  GASOLINE_92: "gasoline-92",
  GASOLINE_95: "gasoline-95",
  GASOLINE_95_PLUS: "gasoline-95+",
  GASOLINE_98: "gasoline-98",
  GASOLINE_100: "gasoline-100",
  DIESEL: "diesel",
};

const fuelExpensesHistory = ref([]);

const cars = ref([]);
onMounted(async () => {
  cars.value = await fetchCars();
})


const selectedCar = ref(null);
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
  fuelExpensesHistory.value = await fetchFuelExpensesHistory();

  const latestCarFuelExpense = fuelExpensesHistory.value.find(
      expense => expense.car_id = newValue.id
  );

  if (latestCarFuelExpense) {
    mileage.value = latestCarFuelExpense.mileage;
  }
});

const latestRefill = computed(() => {
  if (!selectedCar.value) {
    return null;
  }

  return fuelExpensesHistory.value.find(
      expense => expense.car_id = selectedCar.value.id
  );
})


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
    <v-select
        v-model="selectedCar"
        return-object
        label="Select car"
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

    <v-text-field
        v-if="selectedCar"
        v-model="cost"
        type="number"
        label="Enter cost"
    ></v-text-field>

    <v-switch
        v-if="selectedCar"
        v-model="fullTank"
        label="Full tank"
    ></v-switch>

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