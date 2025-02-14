<script setup>
import { VAutocomplete, VListItem, VSelect } from 'vuetify/components';
import { onMounted } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  itemTitle: {
    type: Function,
    required: true,
  },
  selectedItemTitle: {
    type: Function,
    default: null,
  },
  iconUrlResolver: {
    type: Function,
    required: true,
  },
  autocomplete: {
    type: Boolean,
    default: false,
  },
  autoSelectFirst: {
    type: Boolean,
    default: false,
  }
});

const model = defineModel({
  default: null,
});

onMounted(async () => {
  if (props.items.length === 1) {
    model.value = props.items[0];
  }

  if (!model.value && props.items.length > 0 && props.autoSelectFirst) {
    model.value = props.items[0];
  }
});
</script>

<template>
  <component
      :is="autocomplete ? VAutocomplete : VSelect"
      v-model="model"
      return-object
      :label="label"
      :items="items"
      :item-title="itemTitle"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <img
              :src="iconUrlResolver(item.raw)"
              class="selector-item-icon"
          >
        </template>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item, index }">
      <div style="display: flex; align-items: center;">
        <img
            :src="iconUrlResolver(item.raw)"
            class="selector-item-icon"
        >
        <span>{{ selectedItemTitle ? selectedItemTitle(item.raw) : itemTitle(item.raw) }}</span>
      </div>
    </template>
  </component>
</template>

<style scoped>
.selector-item-icon {
  margin-right: 5px;
  width: 16px;
  height: 16px;
}
</style>