<script setup>
import {useUserStore} from "@/store.js";

const {user} = useUserStore();
</script>

<template>
  <h1>Hello, {{ user.firstName }}!</h1>

  <router-link :to="{name: 'add_fuel_expense'}">Add expense</router-link>
</template>
