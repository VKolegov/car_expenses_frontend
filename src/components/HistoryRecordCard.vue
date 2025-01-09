<script setup>
import { computed } from 'vue';
import { mdiGasStation } from '@mdi/js';
import { currencyFormatter, distanceFormatter, formatDate, formatDateTime, formatTime } from '../formatting.js';

const props = defineProps({
  /**
   * @type {HistoryRecord}
   */
  record: {
    type: Object,
    required: true,
  },

  displayOptions: {
    type: Object,
    default: () => ({
      icon: true,
      mileage: true,
      date: true,
    })
  }
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

const title = computed(() => {
  switch (props.record.type) {
    case 1:
      return 'Заправка';
  }
});

const total = computed(
    () => currencyFormatter(Math.ceil(props.record.total))
);

</script>

<template>
  <div
      class="history-record-card"
      @click="emit('click', record, $event)"
  >
    <v-icon
        v-if="displayOptions.icon"
        :icon="icon"
        :color="iconColor"
        class="history-record-card__icon"
    ></v-icon>
    <div class="history-record-card__info">
      <h3 class="history-record-card__title">{{ title }}</h3>
      <span v-if="displayOptions.date">Дата: {{ formatDateTime(record.date) }}</span>
      <span v-if="displayOptions.mileage">Mileage: {{ distanceFormatter(record.mileage) }}</span>
      <span>Итого: {{ total }}</span>
    </div>
  </div>
</template>

<style scoped>
.history-record-card {
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 4px 16px;

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

.history-record-card__title {
  margin-bottom: 2px;
  border-bottom: 1px lightgray solid;
}

.history-record-card__info {
  display: flex;
  flex-direction: column;
  flex-grow: 2;

  white-space: break-spaces;

  gap: 4px;
}
</style>