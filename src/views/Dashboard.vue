<script setup>
import { ref, onMounted } from 'vue';
import api from '../config/api';
import SearchBar from "./component/Searchbar.vue";
import { useRouter } from 'vue-router';
import RecipeDetailModal from './RecipeDetail.vue';

const router = useRouter();
const featuredRecipes = ref([]);
const recommendations = ref({
  summary: [],
  randomCategory: { folderName: '', recipes: [] },
  randomDishes: []
});
const isLoading = ref(true);
const error = ref(null);

const openRecipe = (recipeId) => {
  router.replace({ query: { recipe: recipeId } });
};

onMounted(async () => {
  try {
    // Fetch featured recipes (Latest Recipes)
    const featuredResponse = await api.get('/recipes');
    featuredRecipes.value = featuredResponse.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      tags: recipe.tags || [],
      images: recipe.images || [],
    }));

    // Fetch recommendations with "Food" folder specified
    const recommendationsResponse = await api.get('/user/recommendations?folder_name=Food');
    recommendations.value = recommendationsResponse.data;
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load content. Please try again later.';
    console.error('API Error:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="px-6 pt-8">
      <SearchBar class="w-full" />
    </div>
    <main class="pt-36">
      <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
          What to make this week, as chosen by readers!
        </h1>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-gray-600">
          <div class="animate-pulse space-y-6">
            <div v-for="n in 5" :key="n" class="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center p-6 bg-red-50 rounded-lg">
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button
            @click="onMounted()"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>

        <!-- Content Display -->
        <div v-else class="space-y-12">
          <!-- New Discoveries For You -->
          <section v-if="recommendations.randomDishes.length">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">New Discoveries For You</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="recipe in recommendations.randomDishes"
                :key="recipe.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                @click="openRecipe(recipe.id)"
              >
                <div v-if="recipe.images.length && recipe.images[0] !== 'character(0'" class="relative h-48">
                  <img
                    :src="recipe.images[0]"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div v-else class="h-48 bg-gray-100 flex items-center justify-center">
                  <img src="../assets/noImg.jpg" class="w-32 h-32 opacity-75" alt="No image available">
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ recipe.title }}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ recipe.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in recipe.tags"
                      :key="index"
                      class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- From Your "Food" Collection (Recommendations) -->
          <section v-if="recommendations.randomCategory.recipes.length">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              From Your "{{ recommendations.randomCategory.folderName }}" Collection
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="recipe in recommendations.randomCategory.recipes"
                :key="recipe.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                @click="openRecipe(recipe.id)"
              >
                <div v-if="recipe.images.length && recipe.images[0] !== 'character(0'" class="relative h-48">
                  <img
                    :src="recipe.images[0]"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div v-else class="h-48 bg-gray-100 flex items-center justify-center">
                  <img src="../assets/noImg.jpg" class="w-32 h-32 opacity-75" alt="No image available">
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ recipe.title }}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ recipe.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in recipe.tags"
                      :key="index"
                      class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Latest Recipes (Always Show) -->
          <section>
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Latest Recipes</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="recipe in featuredRecipes"
                :key="recipe.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                @click="openRecipe(recipe.id)"
              >
                <div v-if="recipe.images.length && recipe.images[0] !== 'character(0'" class="relative h-48">
                  <img
                    :src="recipe.images[0]"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div v-else class="h-48 bg-gray-100 flex items-center justify-center">
                  <img src="../assets/noImg.jpg" class="w-32 h-32 opacity-75" alt="No image available">
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ recipe.title }}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{ recipe.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in recipe.tags"
                      :key="index"
                      class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        <RecipeDetailModal v-if="$route.query.recipe" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>