<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../config/api";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const register = async () => {
  errorMessage.value = "";
  try {
    const response = await api.post("/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    alert("Registration successful! You can now log in.");
    router.push("/login"); // Redirect to login page after success
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Registration failed.";
  }
};
</script>

<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Username</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  display: block;
}

button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
}

.error {
  color: red;
}
</style>
