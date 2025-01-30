<script setup>
import { computed } from 'vue';
import { formatCost, formatFuel } from '../formatting.js';
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

const title = computed(() => {

  if (!props.record.category) {
    return '';
  }

  const t = HISTORY_RECORD_CATEGORY_MAP[props.record.category].title;

  // if (props.record.category === HISTORY_RECORD_CATEGORY.REFILL.value) {
  //   const l = formatFuel(props.record.type_data.liters);
  //   return `${t} на ${l}`;
  // }

  return t;
});

const total = computed(
    () => {
      const cost = formatCost(Math.ceil(props.record.total));

      switch (props.record.category) {
        // case HISTORY_RECORD_CATEGORY.REFILL.value:
        //   const l = formatFuel(props.record.type_data.liters);
        //   return `${cost} / ${l}`;
        default:
          return cost;
      }
    }
);

const description = computed(() => {
  if (!props.record.category) {
    return '';
  }

  if (props.record.category === HISTORY_RECORD_CATEGORY.REFILL.value) {
    return 'Залито ' + formatFuel(props.record.type_data.liters)
  }

  return props.record.description;
})

</script>

<template>
  <div
      class="history-record-card"
      @click="emit('click', record, $event)"
  >
    <div class="history-record-card__info">
      <h3 class="history-record-card__title">{{ title }}</h3>
      <span v-if="description"> {{ description }}</span>
      <span>{{ total }}</span>
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