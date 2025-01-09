<script setup>
import { currencyFormatter, distanceFormatter } from '../formatting.js';
import { mdiGasStation } from '@mdi/js';
import { computed } from 'vue';

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
})

</script>

<template>
  <div
      class="history-record-card"
      @click="emit('click', record, $event)"
  >
    <v-icon
        :icon="icon"
        :color="iconColor"
        class="history-record-card__icon"
    ></v-icon>
    <div class="history-record-card__info">
      <span>Date: {{ new Date(record.date).toLocaleString() }}</span>
      <span>Mileage: {{ distanceFormatter(record.mileage) }}</span>
      <span>Total: {{ currencyFormatter(record.total) }}</span>
    </div>
  </div>
</template>

<style scoped>
.history-record-card {
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 4px;

  border: 1px lightgray solid;
  border-radius: 8px;

  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
}

.history-record-card__icon {
  display: block;
  width: 64px;
  height: 64px;

  margin-left: auto;
  margin-right: auto;
  flex-shrink: 2;
  flex-grow: 1;
}

@media screen and (max-width: 768px) {
  .history-record-card__icon {
    width: 48px;
    height: 48px;
  }
}

.history-record-card__info {
  display: flex;
  flex-direction: column;
  flex-grow: 2;

  gap: 4px;
}
</style>