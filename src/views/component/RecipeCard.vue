<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  recipe: Object
});

const getSnippet = () => {
  if (props.recipe.highlights?.Description?.[0]) {
    return props.recipe.highlights.Description[0];
  } else if (props.recipe.highlights?.RecipeIngredientParts?.[0]) {
    return props.recipe.highlights.RecipeIngredientParts[0];
  } else if (props.recipe.highlights?.RecipeInstructions?.[0]) {
    return props.recipe.highlights.RecipeInstructions[0];
  } else {
    return props.recipe.description;
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row">
    <!-- Image -->
    <div class="sm:w-1/3">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.name"
        class="w-full h-48 object-cover rounded-lg"
      />
      <div v-else class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
        No Image
      </div>
    </div>

    <!-- Content -->
    <div class="sm:w-2/3 sm:pl-4 mt-4 sm:mt-0">
      <h3 class="text-lg font-semibold text-gray-800" v-html="recipe.highlights?.Name?.[0] || recipe.name"></h3>
      <p class="text-sm text-gray-600 mt-1" v-html="getSnippet()"></p>
      <div class="mt-2 flex items-center space-x-2 text-sm text-gray-500">
        <span v-if="recipe.rating" class="flex items-center">
          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="ml-1">{{ recipe.rating }}</span>
        </span>
        <span v-if="recipe.reviewCount">({{ recipe.reviewCount }} reviews)</span>
        <span v-if="recipe.cookTime">{{ recipe.cookTime }}</span>
      </div>
    </div>
  </div>
</template>