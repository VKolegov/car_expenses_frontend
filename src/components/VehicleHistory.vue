<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { mdiPlus, mdiPlusCircle } from '@mdi/js';

import { useUserStore } from '@/store.js';
import { fetchFuelExpensesHistory } from '@/api.js';

import { VSelect, VTimeline, VTimelineItem } from 'vuetify/components';

import HistoryRecordCard from '@/components/HistoryRecordCard.vue';
import HistoryTimelineItem from '@/components/HistoryTimelineItem.vue';

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
const historyRecords = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  historyRecords.value = await fetchFuelExpensesHistory(selectedCar.value.id);
});

function onClick (item, event) {
  router.push({
    name: 'edit_history_record',
    params: {
      id: item.id,
    },
  });
}

function onPlusClick() {
  router.push({
    name: 'add_history_record'
  });
}
</script>

<template>
  <h1>История</h1>

  <v-select
      v-model="selectedCar"
      return-object
      label="Автомобиль"
      :items="cars"
      :item-title="car => `${car.brand} ${car.model}`"
  ></v-select>

  <v-timeline
      v-if="selectedCar"
      side="end"
  >
    <v-timeline-item
        :icon="mdiPlus"
        dot-color="transparent"
        @click.native="onPlusClick"
    >
      Новая запись
    </v-timeline-item>
    <history-timeline-item
        v-for="record in historyRecords"
        :record="record"
        @click="onClick"
    ></history-timeline-item>
  </v-timeline>

<!--  <div-->
<!--      v-if="selectedCar"-->
<!--      class="history-record-cards"-->
<!--  >-->
<!--    <history-record-card-->
<!--        v-for="record in historyRecords"-->
<!--        :record="record"-->
<!--        @click="onClick"-->
<!--    ></history-record-card>-->
<!--  </div>-->
</template>

<style scoped>
.history-record-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>