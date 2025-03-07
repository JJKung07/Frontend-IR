<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    await authStore.login(username.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    alert(error.message);
  }
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>