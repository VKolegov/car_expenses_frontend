<script setup>
</script>

<template>
  <div class="garage-page">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.garage-page {
  display: flex;
  flex-direction: column;
}
</style>