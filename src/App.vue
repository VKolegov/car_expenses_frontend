<script setup>
import {mdiChartLine, mdiGasStation} from "@mdi/js";
import {VApp, VBottomNavigation, VContainer, VMain} from "vuetify/components";
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>


    <v-bottom-navigation>
      <v-btn
          value="refills"
          :to="{name: 'refills'}"
      >
        <v-icon :icon="mdiGasStation"></v-icon>

        <span>Refills</span>
      </v-btn>
      <v-btn
          value="charts"
          :to="{name: 'fuel_charts'}"
      >
        <v-icon :icon="mdiChartLine"></v-icon>

        <span>Charts</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>

</style>
