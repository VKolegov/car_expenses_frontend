<script setup>
import { computed } from 'vue';
import { mdiGasStation } from '@mdi/js';

import {VTimelineItem } from 'vuetify/components';

import { distanceFormatter } from '@/formatting.js';

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
  }
});

const iconColor = computed(() => {
  switch (props.record.type) {
    case 1:
      return props.record.type_data.full_tank ? 'green' : 'grey';
  }
});

const leftSideContent = computed(() => {
  return distanceFormatter(props.record.mileage);
  const rounded = round(props.record.mileage, 1)
});

</script>

<template>
  <v-timeline-item
      :icon="icon"
      :dot-color="iconColor"
      @click.native="emit('click', record, $event)"
  >
    <template v-slot:opposite>
      <span>{{ leftSideContent }}</span>
    </template>
    <history-record-card
        :record="record"
        :display-options="{icon: false, mileage: false}"
    ></history-record-card>
  </v-timeline-item>
</template>

<style scoped>

</style>