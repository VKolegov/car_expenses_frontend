<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { VListItem, VSelect, VSwitch, VTextarea } from 'vuetify/components';

import { useUserStore } from '@/store.js';

import { FUEL_TYPES, getFuelTypesByEngineType } from '@/constants/fuel.js';
import { CURRENCY_SYMBOLS } from '@/constants/currency.js';
import { HISTORY_RECORD_CATEGORY } from '@/constants/history_record_category.js';

import {
  fetchBeforeDate,
  createHistoryRecord,
  updateHistoryRecord, getAiItemsDescription,
} from '@/api.js';
import { formatCost } from '@/formatting.js';

import InvoiceItems from '@/components/InvoiceItems.vue';
import CarSelector from '@/components/CarSelector.vue';
import { ENGINE_TYPES } from '@/constants/engine_types.js';

const store = useUserStore();
const router = useRouter();

const props = defineProps({
  /** @type {HistoryRecord} */
  record: {
    type: Object,
    default: null,
  },
});

const selectedCar = ref(null);

/** @type {import('vue').Ref<HistoryRecordType>} */
const recordType = ref(1);
/** @type {import('vue').Ref<HistoryRecordExpenseCategory>} */
const recordCategory = ref('refill');

/** @type {import('vue').Ref<Date>} */
const date = ref(new Date());

watch(date, (newVal) => {
  if (!props.record) {
    updateMileageFromLastRecord();
  }
});

const mileage = ref(0);
const fuelType = ref(null);
const liters = ref(0);
const cost = ref(0);
const fullTank = ref(false);

/** @type {import('vue').Ref<InvoiceItem[]>} */
const invoiceItems = ref([]);

watch(invoiceItems, (newVal) => {
  cost.value = newVal.reduce((sum, item) => sum + item.cost, 0);
}, { deep: true });

const description = ref('');

onMounted(() => {
  if (props.record) {
    setData(props.record);
  }
});

const fuelTypes = computed(() => {
  const engineType = selectedCar.value.modification_info?.engine_type;

  if (!engineType) {
    return Object.values(FUEL_TYPES);
  }

  return  Object.values(getFuelTypesByEngineType(engineType));
});

watch(fuelType, (selectedFuelType) => {

  const engineType = selectedCar.value.modification_info?.engine_type;

  if (!engineType) {
    return;
  }

  const recommendedFuelType = selectedCar.value.modification_info?.fuel_type;

  if (!recommendedFuelType) {
    return;
  }

  if ([ENGINE_TYPES.PETROL, ENGINE_TYPES.HYBRID, ENGINE_TYPES.GAS_PETROL].includes(engineType)) { // TODO: hybrid, gas_petrol
    const recommendedFuelOctaneNumber = parseInt(recommendedFuelType);

    const octaneDiff = parseInt(selectedFuelType.replace('gasoline-', '')) - recommendedFuelOctaneNumber;

    if (octaneDiff < 0) {
      errors.value.set('fuel_type', [`Внимание: для этого двигателя нужен бензин с окт. числом не ниже ${recommendedFuelOctaneNumber}`]);
    } else {
      errors.value.set('fuel_type', [])
    }
  }

});

// for router
/**
 * @param {HistoryRecord} historyRecord
 */
function setData (historyRecord) {
  // TODO: select car id
  mileage.value = historyRecord.mileage;
  recordType.value = historyRecord.type;
  recordCategory.value = historyRecord.category;

  switch (historyRecord.category) {
    case HISTORY_RECORD_CATEGORY.REFILL.value:
      fuelType.value = historyRecord.type_data.fuel_type;
      liters.value = historyRecord.type_data.liters;
      fullTank.value = historyRecord.type_data.full_tank;
      break;
    default:
      if (historyRecord.invoice_items && historyRecord.invoice_items.length > 0) {
        historyRecord.invoice_items.forEach(item => {
          item.cost_formatted = formatCost(item.cost);
        });
        invoiceItems.value = historyRecord.invoice_items;
      }
  }

  cost.value = historyRecord.total;
  description.value = historyRecord.description;

  date.value = new Date(historyRecord.date);
}

watch(selectedCar, (newValue) => {
  if (!newValue) {
    return;
  }

  if (props.record) {
    return;
  }

  updateMileageFromLastRecord();
});

async function updateMileageFromLastRecord() {
  const lastHistoryRecord = await fetchBeforeDate(selectedCar.value.id, date.value);

  if (lastHistoryRecord) {
    mileage.value = lastHistoryRecord.mileage;
  }
}

const generatingDescription = ref(false);
async function generateDescription() {
  generatingDescription.value = true;

  try {
    const r = await getAiItemsDescription(invoiceItems.value.map(item => item.name));

    description.value = r.response;

    alert(`Использование ИИ обошлось в ${r.cost} токен(ов)`);
  } catch (e) {
    console.error(e);
  }

  generatingDescription.value = false;
}

function onGenerateDescriptionClick() {
  generateDescription();
}


// TODO: better validation
const canBeSaved = computed(() => {
  let canBeSaved = selectedCar.value && date.value && cost.value >= 0 && mileage.value > 0;

  switch (recordCategory.value) {
    case HISTORY_RECORD_CATEGORY.REFILL.value:
      canBeSaved = canBeSaved && fuelType.value && liters.value > 0;
  }

  return canBeSaved;
});

const errors = ref(new Map());

function onSaveClick () {
  const data = {
    car_id: selectedCar.value.id,
    date: formatISO(date.value),
    type: recordType.value,
    category: recordCategory.value,
    total: cost.value,
    currency: 'rub',
    mileage: mileage.value,
    description: description.value,
  };

  if (recordCategory.value === HISTORY_RECORD_CATEGORY.REFILL.value) {
    data.fuel_data = {
      fuel_type: fuelType.value,
      liters: liters.value,
      fuel_price: cost.value / liters.value,
      full_tank: fullTank.value,
    }
  } else {
    data.invoice_items = invoiceItems.value.map(item => ({
      ...item,
      category: recordCategory.value
    }));
  }

  const update = Boolean(props.record);

  let promise;

  errors.value.clear();

  if (update) {
    promise = updateHistoryRecord(props.record.id, data);
  } else {
    promise = createHistoryRecord(data);
  }

  promise.then(_ => {
    store.displayNotification(
        `History record ${update ? 'updated' : 'added'}!`,
        'success',
    );

    router.push({ name: 'history' });
  }).catch(error => {

    if (!error.responseBody) {
      store.displayNotification('Error!', 'error');
    } else {
      errors.value = error.getFieldErrors();

      store.displayNotification(
          error.getErrorsAsText(),
          'error',
      );
    }
  });
}

</script>

<template>
  <v-form
      class="fuel-expense-form"
      @submit.prevent
  >
    <h1>{{ record ? 'Редактирование записи' : 'Новая запись' }}</h1>

    <car-selector
        v-model="selectedCar"
    />

    <vue-date-picker
        v-model="date"
        locale="ru-RU"
        format="dd/MM/yyyy HH:mm"
        :format-locale="ru"
        style="margin-bottom: 20px"
    />

    <v-select
        v-if="selectedCar"
        v-model="recordCategory"
        :items="Object.values(HISTORY_RECORD_CATEGORY)"
        item-title="title"
        item-value="value"
    >
      <!-- Слот для отображения иконки и текста выбранного элемента -->
      <template v-slot:selection="{ item }">
        <div class="v-select__selected-item">
          <v-icon>{{ item.raw.icon }}</v-icon>
          <!--          <div class="v-list-item__spacer"></div>-->
          <span>{{ item.title }}</span>
        </div>
      </template>

      <!-- Слот для отображения каждого элемента в выпадающем списке -->
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :prepend-icon="item.raw.icon" :slim="true"/>
      </template>
    </v-select>

    <v-text-field
        v-if="selectedCar"
        v-model.number="mileage"
        type="number"
        label="Пробег"
        suffix="км"
        :error-messages="errors.get('mileage')"
    />

    <v-row v-if="recordCategory === HISTORY_RECORD_CATEGORY.REFILL.value">
      <v-col>
        <v-select
            v-if="selectedCar"
            v-model="fuelType"
            :items="fuelTypes"
            item-title="title"
            item-value="value"
            label="Тип топлива"
            :error-messages="errors.get('fuel_type')"
        />
      </v-col>

      <v-col>
        <v-text-field
            v-if="selectedCar"
            v-model.number="liters"
            type="number"
            label="Литры"
            suffix="л"
            :error-messages="errors.get('liters')"
        />
      </v-col>
    </v-row>


    <v-switch
        v-if="selectedCar && recordCategory === HISTORY_RECORD_CATEGORY.REFILL.value"
        v-model="fullTank"
        label="Полный бак"
    />

    <div
        v-if="selectedCar && recordCategory !== HISTORY_RECORD_CATEGORY.REFILL.value"
        class="fuel-expense-form__invoice-items"
    >
      <h3>Позиции</h3>
      <invoice-items v-model="invoiceItems"/>
    </div>

    <v-text-field
        v-if="selectedCar"
        v-model.number="cost"
        type="number"
        label="Итого"
        :suffix="CURRENCY_SYMBOLS.rub"
        :disabled="recordCategory !== HISTORY_RECORD_CATEGORY.REFILL.value && invoiceItems.length > 0"
        :error-messages="errors.get('cost')"
    />

    <v-textarea
        v-model="description"
        label="Описание"
        :error-messages="errors.get('description')"
    />

    <v-btn
      v-if="!description && recordCategory !== HISTORY_RECORD_CATEGORY.REFILL.value && invoiceItems.length > 0"
      :disabled="generatingDescription"
      @click="onGenerateDescriptionClick"
      style="width: 100%; margin-bottom: 50px;"
    >
      Сгенерировать с помощью AI
    </v-btn>

    <v-btn
        v-if="selectedCar"
        @click="onSaveClick"
        :disabled="!canBeSaved"
        style="width: 100%"
    >
      Сохранить
    </v-btn>

  </v-form>
</template>

<style>
.fuel-expense-form {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .fuel-expense-form {
    padding-bottom: 128px;
  }
}

.fuel-expense-form__invoice-items {
  margin-bottom: 40px;
}

.v-select__selected-item {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
</style>