<script setup>
import { computed } from 'vue';
import { mdiCalendarMonth, mdiGasStation } from '@mdi/js';

import {VTimelineItem } from 'vuetify/components';

import { distanceFormatter, formatDate, formatTime } from '@/formatting.js';

import HistoryRecordCard from '@/components/HistoryRecordCard.vue';
import { round } from 'lodash';

const props = defineProps({
  /**
   * @type {HistoryRecord}
   */
  record: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']);


const icon = computed(() => {
  switch (props.record.type) {
    case 1:
      return mdiGasStation;
    case 'month-break':
      return mdiCalendarMonth;
    default:
      return null;
  }
});

const iconColor = computed(() => {
  switch (props.record.type) {
    case 1:
      return props.record.type_data.full_tank ? 'green' : 'grey';
    case 'month-break':
      return 'white';
    default:
      return 'grey';
  }
});

const mileage = computed(() => {
  return distanceFormatter(props.record.mileage);
  const rounded = round(props.record.mileage, 1)
});
const date = computed(() => formatDate(props.record.date));

</script>

<template>
  <v-timeline-item
      :icon="icon"
      :dot-color="iconColor"
      @click.native="emit('click', record, $event)"
  >
    <template v-slot:opposite>
      <div
          v-if="record.id"
          class="history-timeline-item__left"
      >
        <span class="history-timeline-item__mileage">{{ mileage }}</span>
        <span>{{ date }}</span>
      </div>
    </template>
    <history-record-card
        v-if="record.id"
        :record="record"
    />
    <span
        v-else
        class="history-timeline-item__mileage"
    >
      {{ record.text }}
    </span>
  </v-timeline-item>
</template>

<style scoped>
.history-timeline-item__left {
  display: flex;
  flex-direction: column;
}

.history-timeline-item__mileage {
  font-weight: 500;
}
</style>