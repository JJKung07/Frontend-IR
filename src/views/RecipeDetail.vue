<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../config/api';

const route = useRoute();
const router = useRouter();
const recipe = ref(null);
const isLoading = ref(true);
const error = ref(null);

const parseTime = (duration) => {
  if (!duration) return '';
  const hours = duration.match(/(\d+)H/);
  const minutes = duration.match(/(\d+)M/);
  return [
    hours ? `${hours[1]}h` : '',
    minutes ? `${minutes[1]}m` : ''
  ].filter(Boolean).join(' ') || 'N/A';
};

const mergeSingleCharacters = (items) => {
  if (!items) return [];
  const merged = [];
  let current = '';
  for (const item of items) {
    if (item.length === 1 && !item.match(/[a-z0-9]/i)) {
      current += item;
    } else {
      if (current) {
        merged.push(current);
        current = '';
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

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes/${route.query.recipe}`);
    recipe.value = {
      ...data,
      cookTime: parseTime(data.CookTime),
      prepTime: parseTime(data.PrepTime),
      totalTime: parseTime(data.TotalTime)
    };
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load recipe.';
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
      <div class="relative bg-white rounded-lg max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
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
                <span>⭐ {{ recipe.AggregatedRating }} ({{ recipe.ReviewCount }} reviews)</span>
                <span>👨🍳 {{ recipe.AuthorName }}</span>
                <span>📅 {{ new Date(recipe.DatePublished).toLocaleDateString() }}</span>
              </div>
            </div>

            <img 
              v-if="recipe.Images.length" 
              :src="recipe.Images[0]" 
              class="w-full h-96 object-cover rounded-lg"
            >

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
                        {{ recipe.RecipeIngredientQuantities[index] || '' }}
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
                      <span class="font-bold text-indigo-600">{{ index + 1 }}.</span>
                      <span>{{ step }}</span>
                    </li>
                  </ol>
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