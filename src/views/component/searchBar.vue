<script setup>
// Search logic can be added here
</script>

<template>
  <header class="bg-[#7D0A0A] shadow-md fixed w-full top-0 left-0">
    <nav class="flex flex-col px-6 py-4 space-y-4">
      <!-- Top Row: Brand + Search + Profile -->
      <div class="flex items-center justify-between w-full max-w-4xl mx-auto">
        <!-- Brand -->
        <router-link
          to="/dashboard"
          class="text-2xl font-bold text-white font-serif"
        >
          CookSphere
        </router-link>

        <!-- Right Side: Search + Profile -->
        <div class="flex items-center gap-4">
          <!-- Search Button -->
          <router-link to="/search">
            <button
              class="p-2 hover:bg-rose-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <svg
                class="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </router-link>

          <!-- Profile -->
          <router-link to="/profile">
            <div
              class="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
            >
              <span class="font-medium">U</span>
            </div>
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
