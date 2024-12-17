<script setup>
import {mdiChartBar, mdiGasStation, mdiHistory} from "@mdi/js";
import {VApp} from "vuetify/components";
import {VMain} from "vuetify/components";
import {VContainer} from "vuetify/components";
import {VBottomNavigation} from "vuetify/components";
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
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>

</style>
