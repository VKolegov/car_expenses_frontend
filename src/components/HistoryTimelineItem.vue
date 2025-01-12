<script setup>
import { computed } from 'vue';
import {
  mdiCalendarMonth,
} from '@mdi/js';

import {VTimelineItem } from 'vuetify/components';

import { formatDistance, formatDate } from '@/formatting.js';

import HistoryRecordCard from '@/components/HistoryRecordCard.vue';
import { round } from 'lodash';
import { HISTORY_RECORD_CATEGORY, HISTORY_RECORD_CATEGORY_MAP } from '@/constants/history_record_category.js';

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
  switch (props.record.category) {
    case 'month-break':
      return mdiCalendarMonth; // Иконка для разделения по месяцам
    default:
      return HISTORY_RECORD_CATEGORY_MAP[props.record.category].icon;
  }
});

const iconColor = computed(() => {
  switch (props.record.category) {
    case HISTORY_RECORD_CATEGORY.MAINTENANCE.value:
      return 'white';
    default:
      return null;
  }
});

const backgroundColor = computed(() => {
  switch (props.record.category) {
    case HISTORY_RECORD_CATEGORY.REFILL.value:
      return props.record.type_data.full_tank ? 'green' : 'grey';
    case HISTORY_RECORD_CATEGORY.MAINTENANCE.value:
      return 'orange';
    case 'month-break':
      return 'white';
    default:
      return 'grey';
  }
});

const mileage = computed(() => {
  return formatDistance(props.record.mileage);
  const rounded = round(props.record.mileage, 1)
});
const date = computed(() => formatDate(props.record.date));

</script>

<template>
  <v-timeline-item
      :icon="icon"
      :icon-color="iconColor"
      :dot-color="backgroundColor"
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