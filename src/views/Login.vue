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
  <!-- Root container with background image - Fixed on all sizes -->
  <div 
    class="fixed inset-0 bg-cover bg-center bg-no-repeat" 
    style="background-image: url('/login_bg.jpg');"
  >
    <!-- Background overlay -->
    <div class="absolute inset-0 backdrop-blur-xs"></div>
    
    <!-- Content Container - Scrollable on smaller screens, no gap on mobile -->
    <div
      class="relative z-10 h-full overflow-auto lg:overflow-visible flex flex-col lg:flex-row justify-center items-center py-12 sm:px-6 lg:px-8 gap-0 lg:gap-none"
    >
      <!-- Left Panel - Hidden on mobile, visible on desktop -->
      <div class="hidden lg:block sm:mx-auto sm:max-w-md lg:mr-0">
        <div class="flex flex-col items-center justify-center w-full lg:w-[360px] h-[500px] p-8 space-y-4 lg:bg-[#7D0A0A] lg:rounded-l-2xl">
          <h2 class="text-4xl font-bold text-white mb-2">Sign In</h2>
          <p class="text-sm text-gray-200 mt-4">Welcome to login</p>
        </div>
      </div>

      <!-- Right Form Panel - Full width on mobile with rounded-xl, side-by-side on lg with rounded-r-2xl -->
      <div class="sm:mx-auto sm:w-full sm:max-w-md lg:ml-0">
        <div
          class="bg-white/90 backdrop-blur-sm py-8 px-4 shadow sm:px-10 h-[500px] flex flex-col justify-center rounded-xl lg:rounded-r-2xl lg:rounded-l-none"
        >
          <!-- Sign In heading, visible only on mobile -->
          <h2 class="text-4xl font-bold text-gray-900 mb-8 lg:hidden">Sign In</h2>
          <form @submit.prevent="login" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                USERNAME
              </label>
              <input
                v-model="username"
                type="text"
                required
                placeholder="Enter Username"
                class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                PASSWORD
              </label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="Enter Password"
                class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2 px-4 bg-blue-600 text-black rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>

            <div class="text-center text-sm text-gray-600 mt-8">
              <span class="text-gray-500">Do not have an account?</span>
              <router-link
                to="/register"
                class="ml-2 text-black font-medium"
              >
                Sign up now
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>