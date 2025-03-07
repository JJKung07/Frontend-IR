<script setup>
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
  alert("Logged out!");
};
</script>

<template>
  <button @click="logout">Logout</button>
</template>
