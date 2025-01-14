<script setup>
import { nextTick, ref } from 'vue';
import { mdiPlus } from '@mdi/js';
import { formatCost } from '@/formatting.js';

const NO_EDITING = -1;

/**
 *
 * @type {ModelRef<InvoiceItem[], string, InvoiceItem[], InvoiceItem[]>}
 */
const items = defineModel({
  default: [],
});

const editingI = ref(NO_EDITING);
const editField = ref();
const fieldValue = ref('');

function setEditing (i) {

  if (i === editingI.value) {
    return;
  }

  editingI.value = i;

  if (i === NO_EDITING) {
    // console.debug('disabling editing');
    return;
  }

  if (i < 0 || i >= items.value.length) {
    console.error('Invalid index for editing:', i);
    return;
  }

  // console.debug('set editing', i, items.value[i]);

  const invoiceItem = items.value[i];

  if (!invoiceItem.empty) {
    fieldValue.value = invoiceItem.cost > 0
        ? `${invoiceItem.name} ${invoiceItem.cost}`
        : invoiceItem.name;
  } else {
    fieldValue.value = '';
  }

  nextTick(() => {
    if (editField.value && editField.value.length > 0) {
      editField.value[0].focus();
    }
  });
}

let skipNextBlurEvent = false;

function onBlur (e) {
  //setEditing(NO_EDITING);
  // console.debug('blur rt', e.relatedTarget);
  // console.debug('blur', e);
  if (skipNextBlurEvent) {
    // console.debug('skipping blur');
    skipNextBlurEvent = false;
    return;
  }

  //console.debug('processing blur...');

  const i = editingI.value;
  if (i === items.value.length - 1 && items.value[i].empty) {
    // console.debug('onBlur slice');
    items.value = items.value.slice(0, NO_EDITING);
  }

  nextTick(() => setEditing(NO_EDITING));
}

/**
 *
 * @param {KeyboardEvent} e
 */
function onKeyUp(e) {
  switch (e.key) {
    case 'Enter':
      onEnterPress();
      break;
    case 'Escape':
      setEditing(NO_EDITING);
      break;
  }
}

function onEnterPress () {
  // если редактируем последний элемент в списке
  if (editingI.value === items.value.length - 1) {
    const itWasNewItem = items.value[editingI.value].empty;
    finishEditing();

    if (itWasNewItem) {
      addNewItem();
      skipNextBlurEvent = true;
      setEditing(items.value.length - 1);
    } else {
      setEditing(NO_EDITING);
    }
  } else {
    finishEditing();
    setEditing(NO_EDITING);
  }
}

function finishEditing () {

  //if (items.value[editingI.value].empty) {
  //  items.value = items.value.slice(editingI.value - 1);
  //  return;
  //}

  // TODO:
  //const i = editingI.value;
  //if (i === items.value.length - 1 && items.value[i].empty) {
  //  items.value = items.value.slice(0, NO_EDITING);
  //}

  if (!fieldValue.value) {
    // console.debug('empty string, splicing');
    items.value.splice(editingI.value, 1);
    return;
  }

  /** @type {InvoiceItem} */
  const item = items.value[editingI.value];

  const splitInputValue = fieldValue.value.split(/\s+/);

  if (splitInputValue.length > 1) {
    const cost = parseFloat(
        splitInputValue[splitInputValue.length - 1].replace(',', '.'),
    );

    if (!Number.isNaN(cost)) {
      item.cost = cost;
      item.cost_formatted = formatCost(cost);
    }

    item.name = splitInputValue.slice(0, -1).join(' ');
  } else {
    item.name = splitInputValue[0];
  }

  item.empty = false;

  //items.value.splice(editingI.value, 1, item);
  // console.debug('finished editing', item, items.value);
}

function addNewItem () {
  items.value.push({
    name: '',
    cost: 0,
    cost_formatted: 'бесплатно',
    category: '',
    empty: true,
  });
}

function onAddClick () {
  // console.debug('add click');
  addNewItem();
  setEditing(items.value.length - 1);
}
</script>

<template>
  <div class="invoice-items">
    <div class="invoice-item" v-if="items.length > 0">
      <span>#</span>
      <span>Наименование</span>
      <span class="invoice-item__cost">Цена</span>
    </div>
    <div
        v-for="(item, i) in items"
        :key="i"
        class="invoice-item"
        @click="setEditing(i)"
    >
      <v-text-field
          v-if="i === editingI"
          ref="editField"
          density="compact"
          v-model="fieldValue"
          @blur="onBlur"
          @keyup="onKeyUp"
          class="invoice-item__edit-field"
          :hide-details="true"
      />
      <span>{{ i + 1 }}</span>
      <span>{{ item.name }}</span>
      <span class="invoice-item__cost">{{ item.cost_formatted }}</span>
    </div>
    <v-btn
        :prepend-icon="mdiPlus"
        style="width: 100%"
        @click="onAddClick"
    >
      Добавить позицию
    </v-btn>
  </div>
</template>

<style scoped>
.invoice-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invoice-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  padding: 2px 8px;

  border-bottom: 1px solid lightgray;

  position: relative;
  height: 42px; /* approx v-text-field height */
}

.invoice-item__cost {
  display: block;
  margin-left: auto;
}

.invoice-item__edit-field {
  position: absolute;

  background-color: white;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}


</style>