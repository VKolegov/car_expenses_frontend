<script setup>
import { useUserStore } from '@/store.js';

const { user } = useUserStore();
</script>

<template>
  <h1>Hello, {{ user.firstName }}!</h1>
  <h2>This app is currently under lazy development</h2>
</template>
