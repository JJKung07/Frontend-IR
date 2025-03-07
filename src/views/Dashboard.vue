<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Add auto-redirect if not authenticated
if (!authStore.user) {
  router.push('/login');
}
</script>

<template>
  <div>
    <h2>Welcome to Dashboard</h2>
    <Logout />
  </div>
</template>
