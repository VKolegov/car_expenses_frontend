<script setup>
import { useUserStore } from '@/store.js';
import { computed } from 'vue';
import { formatDate, formatDistance } from '../formatting.js';

const store = useUserStore();

const cars = computed(() => store.userCars);
</script>

<template>
  <div class="garage-page">
    <h1>Гараж</h1>

    <div class="garage-page__user-cars user-car-cards">
      <div
          v-for="car in cars"
          class="user-car-card"
      >
        <div class="user-car-card__model-name">
          <img :src="car.brand_info.logo_image" width="16px" height="16px">
          {{ car.brand_info.name }} {{ car.model_info.short_name }}
        </div>
        <div>Поколение: {{ car.generation_info.short_name }}</div>
        <div>Модификация: {{ car.modification_info.name_ru }}</div>
        <div v-if="car.vin">VIN: {{ car.vin }}</div>
        <div v-if="car.chassis_number">Номер кузова: {{ car.chassis_number }}</div>
        <div>Гос. номер: {{ car.registration_number }}</div>
        <div>Привод: {{ car.modification_info.drivetrain }}</div>
        <div>Мощность: {{ car.modification_info.engine_horsepower }} л.с., {{ car.modification_info.engine_torque }} Н*м
          @ {{ car.modification_info.engine_horsepower_rpm }} Об/мин
        </div>
        <div>Дата покупки: {{ formatDate(car.added_at) }}</div>
        <div>Пробег при покупке: {{ formatDistance(car.mileage) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.garage-page {
  display: flex;
  flex-direction: column;
}

.garage-page__user-cars {
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