<script setup lang="ts">
import Dashboard from "./views/Dashboard.vue";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { store } from "./stores";
import App from "./App.vue";
</script>

<template>
  <!-- This will show the correct page (Login, Dashboard, etc.) -->
  <router-view />
</template>

<style scoped>

</style>
