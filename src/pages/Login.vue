<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store.js';

const router = useRouter();

const phone = ref('');
const password = ref('');

async function attemptLogin () {
  const userStore = useUserStore();

  const success = await userStore.auth(phone.value, password.value);
  if (success) {
    await router.push({ name: 'refills' });
  }
}
</script>

<template>
  <v-form @submit.prevent="attemptLogin" style="width: 100%">
    <v-text-field v-model="phone" label="Phone"></v-text-field>
    <v-text-field v-model="password" label="Password" type="password"></v-text-field>
    <v-btn type="submit">Login</v-btn>
  </v-form>
</template>

<style scoped>

</style>