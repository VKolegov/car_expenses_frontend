<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { mdiPlus } from '@mdi/js';

import { fetchHistoryRecords } from '@/api.js';

import { VTimeline, VTimelineItem } from 'vuetify/components';
import HistoryTimelineItem from '@/components/HistoryTimelineItem.vue';
import CarSelector from '@/components/CarSelector.vue';

const router = useRouter();

const selectedCar = ref(null);


/** @type {import('vue').Ref<HistoryRecord[]>} */
const historyRecords = ref([]);

watch(selectedCar, async (newValue) => {
  if (!newValue) {
    return;
  }

  // order date desc
  historyRecords.value = await fetchHistoryRecords(selectedCar.value.id);
});

const historyTimeline = computed(() => {
  const timeline = [];

  if (historyRecords.value.length === 0) {
    return timeline;
  }

  const monthFormatter = value => format(value, 'LLLL yyyy', {locale: ru});

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
})

function onClick (item, event) {
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
    name: 'add_history_record'
  });
}
</script>

<template>
  <h1>История</h1>

  <car-selector
      v-model="selectedCar"
  />

  <v-timeline
      v-if="selectedCar && historyTimeline.length > 0"
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
</template>

<style scoped>
</style>