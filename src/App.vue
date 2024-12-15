<script setup>
import {mdiChartBar, mdiGasStation} from "@mdi/js";
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>


    <v-bottom-navigation>
      <v-btn value="statistics" :to="{name: 'statistics'}">
        <v-icon :icon="mdiChartBar"></v-icon>

        <span>Statistics</span>
      </v-btn>

      <v-btn
          value="add-refill"
          :to="{name: 'add_fuel_expense'}"
      >
        <v-icon :icon="mdiGasStation"></v-icon>

        <span>Add refill</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>

</style>
