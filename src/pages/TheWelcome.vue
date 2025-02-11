<script setup>
import { useUserStore } from '@/store.js';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { user, userCars } = useUserStore();

onMounted(() => {
  if (user && userCars.length > 0) {
    router.push({name: 'history'});
  } else {
    router.push({name: 'garage'});
  }
})
</script>

<template>
  <h1>Привет, {{ user.first_name }}!</h1>
  <h2>Приложение еще в разработке</h2>
  <span>Но уже есть:</span>
  <ul style="padding: 0 20px 20px 20px;">
    <li>Добавление и редактирование расходов на топливо</li>
    <li>Добавление и редактирование расходов на сервис/обслуживание и прочие</li>
    <li>Добавление и редактирование позиций расходов</li>
    <li>Подсчет статистики</li>
    <li>Графики</li>
    <li>База данных автомобилей</li>
  </ul>
</template>
