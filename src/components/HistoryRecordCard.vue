<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../formatting.js';

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
  switch (props.record.type) {
    case 1:
      return 'Заправка';
    default:
      return '';
  }
});

const total = computed(
    () => formatCurrency(Math.ceil(props.record.total))
);

</script>

<template>
  <div
      class="history-record-card"
      @click="emit('click', record, $event)"
  >
    <div class="history-record-card__info">
      <h3 class="history-record-card__title">{{ title }}</h3>
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