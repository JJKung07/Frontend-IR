<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSearch } from '../stores/search';
</script>

<template>
  <router-view />
</template>