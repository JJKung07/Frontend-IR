<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../config/api";

const route = useRoute();
const router = useRouter();
const recipe = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Bookmark related state
const showDropdown = ref(false);
const selectedFolderId = ref(null);
const rating = ref(null);
const folders = ref([]);
const bookmarkError = ref("");

const parseTime = (duration) => {
  if (!duration) return "";
  const hours = duration.match(/(\d+)H/);
  const minutes = duration.match(/(\d+)M/);
  return (
    [hours ? `${hours[1]}h` : "", minutes ? `${minutes[1]}m` : ""]
      .filter(Boolean)
      .join(" ") || "N/A"
  );
};

const mergeSingleCharacters = (items) => {
  if (!items) return [];
  const merged = [];
  let current = "";
  for (const item of items) {
    if (item.length === 1 && !item.match(/[a-z0-9]/i)) {
      current += item;
    } else {
      if (current) {
        merged.push(current);
        current = "";
      }
      merged.push(item);
    }
  }
  if (current) merged.push(current);
  return merged;
};

const mergedIngredients = computed(() => {
  return mergeSingleCharacters(recipe.value?.RecipeIngredientParts || []);
});

const mergedInstructions = computed(() => {
  return mergeSingleCharacters(recipe.value?.RecipeInstructions || []);
});

const closeModal = () => {
  router.replace({ query: {} });
};

// Bookmark functions
const toggleDropdown = async () => {
  try {
    if (!folders.value.length) {
      const { data } = await api.get("/user/folders");
      folders.value = data;
    }
    showDropdown.value = !showDropdown.value;
  } catch (err) {
    bookmarkError.value =
      err.response?.data?.error || "Failed to load folders.";
  }
};

const bookmarkRecipe = async () => {
  if (!selectedFolderId.value) {
    bookmarkError.value = "Please select a folder.";
    return;
  }
  try {
    await api.post("/user/bookmarks", {
      folderId: selectedFolderId.value,
      recipeId: route.query.recipe,
      rating: rating.value,
    });
    showDropdown.value = false;
    selectedFolderId.value = null;
    rating.value = null;
    alert("Recipe bookmarked successfully!");
  } catch (err) {
    bookmarkError.value =
      err.response?.data?.error || "Failed to bookmark recipe.";
  }
};

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes/${route.query.recipe}`);
    recipe.value = {
      ...data,
      cookTime: parseTime(data.CookTime),
      prepTime: parseTime(data.PrepTime),
      totalTime: parseTime(data.TotalTime),
      Images: Array.isArray(data.Images) ? data.Images : [],
    };
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load recipe.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-lg max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>

        <div class="p-6 space-y-8">
          <div v-if="isLoading" class="text-center">Loading recipe...</div>
          <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

          <div v-if="recipe" class="space-y-8">
            <div class="text-center">
              <h1 class="text-4xl font-bold mb-4">{{ recipe.Name }}</h1>
              <div class="flex justify-center gap-4 text-gray-600">
                <span
                  >⭐ {{ recipe.AggregatedRating }} ({{
                    recipe.ReviewCount
                  }}
                  reviews)</span
                >
                <span>👨🍳 {{ recipe.AuthorName }}</span>
                <span
                  >📅
                  {{
                    new Date(recipe.DatePublished).toLocaleDateString()
                  }}</span
                >
              </div>
            </div>

            <!-- Image Section -->
            <div class="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
              <img
                v-if="
                  recipe.Images.length > 0 && recipe.Images[0] !== 'character(0'
                "
                :src="recipe.Images[0]"
                class="w-full h-full object-cover"
                :alt="recipe.Name"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center text-gray-400"
              >
                <img
                  src="../assets/noImg.jpg"
                  class="w-60 h-60 mb-4 opacity-75"
                  alt="No image available"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
              <div class="md:col-span-2 space-y-6">
                <div>
                  <h2 class="text-2xl font-semibold mb-4">Description</h2>
                  <p class="text-gray-700">{{ recipe.Description }}</p>
                </div>

                <div>
                  <h2 class="text-2xl font-semibold mb-4">Ingredients</h2>
                  <ul class="grid grid-cols-2 gap-4">
                    <li
                      v-for="(ingredient, index) in mergedIngredients"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <span class="text-indigo-600">
                        {{ recipe.RecipeIngredientQuantities[index] || "" }}
                      </span>
                      {{ ingredient }}
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 class="text-2xl font-semibold mb-4">Instructions</h2>
                  <ol class="space-y-4 text-left">
                    <li
                      v-for="(step, index) in mergedInstructions"
                      :key="index"
                      class="flex gap-4"
                    >
                      <span class="font-bold text-indigo-600"
                        >{{ index + 1 }}.</span
                      >
                      <span>{{ step }}</span>
                    </li>
                  </ol>

                  <!-- Bookmark Section -->
                  <div class="mt-8 relative">
                    <button
                      @click="toggleDropdown"
                      class="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      📌 Bookmark This Recipe
                      <svg
                        class="w-4 h-4 transition-transform"
                        :class="{ 'rotate-180': showDropdown }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <!-- Dropdown -->
                    <div
                      v-if="showDropdown"
                      class="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div class="p-4 space-y-4">
                        <div class="space-y-2">
                          <label class="block text-sm font-medium text-gray-700"
                            >Select Folder</label
                          >
                          <select
                            v-model="selectedFolderId"
                            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="" disabled>Choose a folder</option>
                            <option
                              v-for="folder in folders"
                              :key="folder.id"
                              :value="folder.id"
                            >
                              {{ folder.name }}
                            </option>
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="block text-sm font-medium text-gray-700"
                            >Rating (optional)</label
                          >
                          <input
                            v-model.number="rating"
                            type="number"
                            min="1"
                            max="5"
                            placeholder="1-5"
                            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <div class="flex justify-end gap-3">
                          <button
                            @click="showDropdown = false"
                            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            @click="bookmarkRecipe"
                            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                        </div>

                        <p
                          v-if="bookmarkError"
                          class="text-red-500 text-sm mt-2"
                        >
                          {{ bookmarkError }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                  <h3 class="text-xl font-semibold mb-4">Nutrition Facts</h3>
                  <dl class="space-y-2">
                    <div v-for="(value, key) in recipe.nutrition" :key="key">
                      <dt class="capitalize">{{ key }}</dt>
                      <dd class="text-gray-600 ml-4">{{ value }}g</dd>
                    </div>
                  </dl>
                </div>

                <div class="bg-gray-50 p-6 rounded-lg">
                  <h3 class="text-xl font-semibold mb-4">Details</h3>
                  <div class="space-y-2">
                    <p>⏲️ Cook Time: {{ recipe.cookTime }}</p>
                    <p>⏱️ Prep Time: {{ recipe.prepTime }}</p>
                    <p>⏰ Total Time: {{ recipe.totalTime }}</p>
                    <p>🍽️ Servings: {{ recipe.RecipeServings }}</p>
                    <p>📌 Category: {{ recipe.RecipeCategory }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
