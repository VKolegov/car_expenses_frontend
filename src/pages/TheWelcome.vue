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
  <h1>Hello, {{ user.first_name }}!</h1>
  <h2>This app is currently under lazy development</h2>
</template>
