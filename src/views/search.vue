<script setup>
import RecipeCard from "./component/RecipeCard.vue";
import SearchBar from "./component/searchBar.vue";
import { useSearch } from "../stores/search";
import { useRouter } from 'vue-router';
import RecipeDetailModal from './RecipeDetail.vue';

const router = useRouter();
const {
  query,
  results,
  total,
  page,
  loading,
  error,
  suggestion,
  totalPages,
  search,
  handlePageChange,
  useSuggestion,
} = useSearch();

const openRecipe = (recipeId) => {
  router.replace({ query: { ...router.currentRoute.value.query, recipe: recipeId } });
};
</script>

<template>
  <div class="flex gap-8 max-w-7xl mx-auto px-6 py-8">
    <!-- Main Content -->
    <div class="flex-1">
      <div class="px-6 pt-8">
        <SearchBar class="w-full" />
      </div>

      <div class="p-6">
        <!-- Search Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class=" text-lg font-semibold text-gray-800">
            Search Results for: <span class="text-rose-600">{{ query }}</span>
          </h1>
        </div>

        <!-- Existing search functionality -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="query"
              type="text"
              placeholder="Search for recipes..."
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700"
            />
            <span
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
          </div>
        </div>

        <!-- Conditional renders -->
        <div v-if="suggestion?.text" class="mb-4 text-center text-gray-600">
          Did you mean:
          <a
            @click.prevent="useSuggestion"
            class="text-black hover:underline cursor-pointer "
            >{{ suggestion.text }}</a
          >?
        </div>

        <div v-if="loading" class="text-center">
          <!-- Loading spinner -->
        </div>

        <div
          v-else-if="error"
          class="text-red-500 text-center p-4 bg-red-100 rounded-lg"
        >
          {{ error }}
        </div>

        <div
          v-else-if="total === 0"
          class="text-center text-gray-600 p-4 bg-gray-100 rounded-lg"
        >
          <!-- No results message -->
        </div>

        <div v-else>
          <div class="space-y-4">
            <div 
              v-for="recipe in results"
              :key="recipe.id"
              @click="openRecipe(recipe.id)"
              class="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <RecipeCard
                :recipe="recipe"
                class="bg-white p-6 rounded-xl shadow-sm"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-center items-center space-x-4">
            <button
              @click="handlePageChange(page - 1)"
              :disabled="page <= 1"
              class="px-4 py-2 bg-rose-600 text-black rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span class="text-gray-700"
              >Page {{ page }} of {{ totalPages }}</span
            >
            <button
              @click="handlePageChange(page + 1)"
              :disabled="page >= totalPages"
              class="px-4 py-2 bg-rose-600 text-black rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RecipeDetailModal v-if="$route.query.recipe" />
    </div>
  </div>
</template>