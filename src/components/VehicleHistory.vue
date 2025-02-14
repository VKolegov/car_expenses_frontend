<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { VTimeline, VTimelineItem } from 'vuetify/components';
import { mdiPlus } from '@mdi/js';

import { useUserStore } from '@/store.js';
import { fetchHistoryRecords } from '@/api/history_records.js';

import HistoryTimelineItem from '@/components/HistoryTimelineItem.vue';
import CarSelector from '@/components/CarSelector.vue';

const store = useUserStore();
const router = useRouter();

const selectedCar = computed(() => store.selectedCar);

/** @type {import('vue').Ref<HistoryRecord[]>} */
const historyRecords = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  historyRecords.value = await fetchHistoryRecords(selectedCar.value.id);
}, { immediate: true });

const historyTimeline = computed(() => {
  const timeline = [];

  if (historyRecords.value.length === 0) {
    return timeline;
  }

  const monthFormatter = value => format(value, 'LLLL yyyy', { locale: ru });

  let lastMonth = monthFormatter(historyRecords.value[0].date);

  for (const record of historyRecords.value) {
    const month = monthFormatter(record.date);

    if (month !== lastMonth) {
      timeline.push({
        category: 'month-break',
        text: lastMonth,
      });
      lastMonth = month;
    }

    timeline.push(record);
  }

  return timeline;
});

function onClick(item, event) {
  if (!item.id) {
    return;
  }

  router.push({
    name: 'edit_history_record',
    params: {
      id: item.id,
    },
  });
}

function onPlusClick() {
  router.push({
    name: 'add_history_record',
  });
}
</script>

<template>
  <div class="vehicle-history">
    <h1>История</h1>

    <car-selector/>

    <v-timeline
        v-if="selectedCar"
        side="end"
        truncate-line="end"
    >
      <v-timeline-item
          :icon="mdiPlus"
          dot-color="transparent"
          @click.native="onPlusClick"
      >
        Новая запись
      </v-timeline-item>

      <history-timeline-item
          v-for="record in historyTimeline"
          :record="record"
          @click="onClick"
      ></history-timeline-item>
    </v-timeline>
  </div>
</template>

<style scoped>
</style>