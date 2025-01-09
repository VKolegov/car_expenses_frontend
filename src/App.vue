<script setup>
import { mdiChartLine, mdiClipboardTextClock } from '@mdi/js';
import { VApp, VBottomNavigation, VContainer, VMain, VSnackbar } from 'vuetify/components';
import { useUserStore } from '@/store.js';

const store = useUserStore();


if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.disableVerticalSwipes();
}
</script>

<template>
  <v-app>
    <v-main>
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


    <v-bottom-navigation style="height: 75px;">
      <v-btn
          value="history"
          :to="{name: 'history'}"
      >
        <v-icon :icon="mdiClipboardTextClock" size="x-large"></v-icon>

        <span>History</span>
      </v-btn>
      <v-btn
          value="charts"
          :to="{name: 'fuel_charts'}"
      >
        <v-icon :icon="mdiChartLine" size="x-large"></v-icon>

        <span>Charts</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<style>
.v-application__wrap {
  max-height: var(--tg-viewport-height, 100dvh);
}

.v-main {
  height: 100%;
  overflow-y: auto;
}
</style>
