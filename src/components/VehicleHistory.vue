<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store.js';

import { VFab, VSelect } from 'vuetify/components';

import { fetchFuelExpensesHistory } from '@/api.js';
import { mdiPlus } from '@mdi/js';
import { useRouter } from 'vue-router';
import HistoryRecordCard from '@/components/HistoryRecordCard.vue';

const store = useUserStore();
const router = useRouter();

const cars = computed(() => store.userCars);
const selectedCar = ref(null);

onMounted(async () => {
  if (cars.value.length === 1) {
    selectedCar.value = cars.value[0];
  }
});

/** @type {import('vue').Ref<HistoryRecord<HistoryRefillData>[]>} */
const fuelExpensesHistory = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  fuelExpensesHistory.value = await fetchFuelExpensesHistory(selectedCar.value.id);
});

function onClick (item, event) {
  router.push({
    name: 'edit_history_record',
    params: {
      id: item.id,
    },
  });
}
</script>

<template>
  <h1>History records (WIP)</h1>

  <v-select
      v-model="selectedCar"
      return-object
      label="Select car to view history"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>


  <div
      v-if="selectedCar"
      class="history-record-cards"
  >
    <history-record-card
        v-for="record in fuelExpensesHistory"
        :record="record"
        @click="onClick"
    ></history-record-card>
  </div>

  <v-fab
      :icon="mdiPlus"
      :to="{name: 'add_history_record'}"
      offset
      class="fixed"
  ></v-fab>
</template>

<style scoped>
.fixed {
  position: fixed;
  right: 55px;
  bottom: 105px;
}

.history-record-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>