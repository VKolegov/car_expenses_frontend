<script setup>
import { mdiCarClock, mdiChartLine, mdiClipboardTextClock, mdiGarage } from '@mdi/js';
import { VApp, VBottomNavigation, VContainer, VMain, VSnackbar } from 'vuetify/components';
import { useUserStore } from '@/store.js';

const store = useUserStore();


if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.disableVerticalSwipes();
}
</script>

<template>
  <v-app>
    <v-main class="app-main">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <v-snackbar
          v-model="store.notificationDisplayed"
          :color="store.notificationColor"
          elevation="24"
          timeout="5000"
          origin="top center"
          multi-line
      >
        {{ store.notificationText }}
      </v-snackbar>

    </v-main>


    <v-bottom-navigation v-show="store.user" style="height: 75px;">
      <v-btn
          value="garage"
          :to="{name: 'garage'}"
      >
        <v-icon :icon="mdiGarage" size="x-large"></v-icon>

        <span>Гараж</span>
      </v-btn>
      <v-btn
          v-if="store.userCars.length > 0"
          value="statistics"
          :to="{name: 'statistics'}"
      >
        <v-icon :icon="mdiCarClock" size="x-large"></v-icon>

        <span>Статистика</span>
      </v-btn>
      <v-btn
          v-if="store.userCars.length > 0"
          value="history"
          :to="{name: 'history'}"
      >
        <v-icon :icon="mdiClipboardTextClock" size="x-large"></v-icon>

        <span>История</span>
      </v-btn>
      <v-btn
          v-if="store.userCars.length > 0"
          value="charts"
          :to="{name: 'fuel_charts'}"
      >
        <v-icon :icon="mdiChartLine" size="x-large"></v-icon>

        <span>График</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<style>
.app-main {
  padding-bottom: 75px;
}
.v-application__wrap {
  max-height: var(--tg-viewport-height, 100dvh);
}

.v-main {
  height: 100%;
  overflow-y: auto;
}
</style>
