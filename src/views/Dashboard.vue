<script setup>
import SearchBar from "./component/Searchbar.vue";

const featuredRecipes = [
  {
    title: "Frittata Egg Muffins",
    description: "Grab & go breakfast and work lunches (healthy!)",
    tags: ["breakfast", "meal prep"],
  },
  {
    title: "Thai Fish Cakes",
    description: "Crispy and flavorful appetizers",
    tags: ["thai", "seafood"],
  },
  {
    title: "Pitcracker Beet",
    description: "Sweet and savory roasted beets",
    tags: ["vegetarian", "side dish"],
  },
  {
    title: "Chicken Fajitas",
    description: "Sizzling Tex-Mex classic",
    tags: ["mexican", "chicken"],
  },
  {
    title: "Magic Stay-Fresh Apple Muffins",
    description: "Moist muffins that stay fresh longer",
    tags: ["baking", "snack"],
  },
];
</script>

<template>
  <div>
    <div class="px-6 pt-8"> <!-- Added container -->
      <SearchBar class="w-full" />
    </div>
    <main class="pt-36">
      <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
          What to make this week, as chosen by readers!
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(recipe, index) in featuredRecipes"
            :key="index"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              {{ recipe.title }}
            </h2>
            <p class="text-gray-600 mb-4">{{ recipe.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, tagIndex) in recipe.tags"
                :key="tagIndex"
                class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>