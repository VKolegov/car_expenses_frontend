<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store.js';
import { formatDate, formatDistance } from '@/formatting.js';
import { useRouter } from 'vue-router';
import { mdiPlus } from '@mdi/js';

const router = useRouter();

const store = useUserStore();
const cars = computed(() => store.userCars);

function onAddClick() {
  router.push({ name: 'add_user_car' });
}
</script>

<template>
  <div class="user-cars">
    <h1>Гараж</h1>

    <div class="user-cars-list user-car-cards">
      <div
          v-for="car in cars"
          class="user-car-card"
      >
        <div class="user-car-card__model-name">
          <img :src="car.brand_info.logo_image" width="16px" height="16px">
          {{ car.brand_info.name }} {{ car.model_info.short_name }}
        </div>
        <div v-if="car.vin">VIN: {{ car.vin }}</div>
        <div v-else-if="car.chassis_number">Номер кузова: {{ car.chassis_number }}</div>
        <div>Гос. номер: {{ car.registration_number ?? 'Не указан' }}</div>
        <div v-if="car.generation_info">Поколение: {{ car.generation_info.short_name }}</div>
        <div v-if="car.modification_info">Модификация: {{ car.modification_info.name }}</div>
        <div v-if="car.modification_info.engine_displacement">Объём двигателя: {{ car.modification_info.engine_displacement }} см<sup>3</sup></div>
        <div v-if="car.modification_info">Мощность: {{ car.modification_info.engine_horsepower }} л.с.,
          {{ car.modification_info.engine_torque }} Н*м
          @ {{ car.modification_info.engine_horsepower_rpm }} Об/мин
        </div>
        <div v-if="car.modification_info">Привод: {{ car.modification_info.drivetrain }}</div>
        <div>Дата покупки: {{ formatDate(car.purchased_at) }}</div>
        <div>Пробег при покупке: {{ formatDistance(car.mileage) }}</div>
      </div>
      <div
          class="user-car-card"
          @click="onAddClick"
      >
      <span>
      <v-icon :icon="mdiPlus"/> Добавить
      </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-cars-list {
  margin-top: 50px;
}

.user-car-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-car-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;

  border: 1px solid lightgray;
  border-radius: 8px;
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
}

.user-car-card__model-name {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1.2rem;
}
</style>