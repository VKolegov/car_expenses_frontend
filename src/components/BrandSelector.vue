<script setup>
import { VListItem, VAutocomplete } from 'vuetify/components';

const props = defineProps({
  brands: {
    type: Array,
    required: true
  }
})

const model = defineModel({
  default: null
});
</script>

<template>
  <v-autocomplete
      v-model="model"
      return-object
      label="Бренд"
      :items="brands"
      :item-title="b => b.name"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <img
              :src="item.raw.logo_image"
              class="car-brand-logo"
          >
        </template>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item, index }">
      <div style="display: flex; align-items: center;">
        <img
            :src="item.raw.logo_image"
            class="car-brand-logo"
        >
        <span>{{ item.raw.name }}</span>
      </div>
    </template>
  </v-autocomplete>
</template>

<style scoped>
.car-brand-logo {
  margin-right: 5px;
  width: 16px;
  height: 16px;
}
</style>