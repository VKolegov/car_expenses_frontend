<script setup>
import { mdiContentSave } from '@mdi/js';

const props = defineProps({
  /** @type {'create'|'update'} */
  mode: {
    type: String,
    default: 'create',
    validator: value => ['create', 'update'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <div>
    <v-btn
        type="submit"
        :icon="mdiContentSave"
        color="primary"
        class="save-btn-mobile"
        :disabled="disabled"
    />

    <v-btn
        type="submit"
        class="save-btn"
        :disabled="disabled"
    >
      {{ mode === 'update' ? 'Сохранить' : 'Добавить' }}
    </v-btn>
  </div>
</template>

<style scoped>
.save-btn {
  width: 100%;
}

.save-btn-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .save-btn {
    display: none;
  }

  .save-btn-mobile {
    display: block;
    bottom: 85px;
    right: 10px;
    position: fixed;
  }
}
</style>