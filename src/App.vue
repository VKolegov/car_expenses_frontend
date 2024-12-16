<script setup>
import {mdiChartBar, mdiGasStation, mdiHistory} from "@mdi/js";
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>


    <v-bottom-navigation>
      <v-btn value="refill_history" :to="{name: 'refill_history'}">
        <v-icon :icon="mdiHistory"></v-icon>

        <span>Refill history</span>
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
