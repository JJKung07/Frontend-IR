<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../config/api";
import SearchBar from "./component/Searchbar.vue";
import { useAuthStore } from "../stores/auth";
import RecipeDetailModal from "./RecipeDetail.vue";

const folders = ref([]);
const newFolderName = ref("");
const bookmarks = ref([]);
const recommendations = ref({});
const error = ref("");
const authStore = useAuthStore();
const router = useRouter();

// State for rating editing
const editingBookmark = ref(null); // Tracks which bookmark is being edited (recipeId)
const tempRating = ref(1); // Temporary rating during editing, defaults to 1

// Folder functions
const fetchFolders = async () => {
  try {
    const { data } = await api.get("/user/folders");
    folders.value = data;
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load folders.";
  }
};

const createFolder = async () => {
  if (!newFolderName.value.trim()) return;
  try {
    await api.post("/user/folders", { name: newFolderName.value.trim() });
    await fetchFolders();
    newFolderName.value = "";
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to create folder.";
  }
};

const deleteFolder = async (folderId) => {
  if (!confirm("Are you sure you want to delete this folder?")) return;
  try {
    await api.delete(`/user/folders/${folderId}`);
    await fetchFolders();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to delete folder.";
  }
};

const updateFolder = async (folderId, newName) => {
  try {
    await api.put(`/user/folders/${folderId}`, { name: newName });
    await fetchFolders();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to update folder.";
  }
};

const renameFolder = async (folderId, currentName) => {
  const newName = prompt("Enter new name:", currentName);
  if (newName !== null && newName.trim() !== "") {
    await updateFolder(folderId, newName.trim());
  }
};

// Bookmark functions
const fetchBookmarks = async () => {
  try {
    const { data } = await api.get("/user/bookmarks");
    bookmarks.value = data;
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load bookmarks.";
  }
};

// Toggle editing mode and set initial tempRating
const toggleEditRating = (recipeId, currentRating) => {
  if (editingBookmark.value === recipeId) {
    editingBookmark.value = null; // Close if already editing
  } else {
    editingBookmark.value = recipeId;
    tempRating.value = currentRating || 1; // Default to 1 if no rating
  }
};

// Update rating with selected stars
const updateBookmarkRating = async (folderId, recipeId) => {
  try {
    await api.put(`/user/bookmarks/${folderId}/${recipeId}`, {
      rating: tempRating.value,
    });
    await fetchBookmarks();
    editingBookmark.value = null; // Close editing mode after saving
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to update rating.";
  }
};

// Set temporary rating when clicking a star
const setRating = (value) => {
  tempRating.value = value;
};

const removeBookmark = async (folderId, recipeId) => {
  if (!confirm("Are you sure you want to remove this bookmark?")) return;
  try {
    await api.delete(`/user/bookmarks/${folderId}/${recipeId}`);
    await fetchBookmarks();
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to remove bookmark.";
  }
};

const getSuggestions = async (folderId) => {
  try {
    const { data } = await api.get(`/user/folders/${folderId}/suggestions`);
    recommendations.value[folderId] = data;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      alert(err.response.data.error);
    } else {
      console.error("Failed to get suggestions:", err);
      error.value = "Failed to load suggestions.";
    }
  }
};

const showRecipeDetail = (recipeId) => {
  router.push({ query: { recipe: recipeId } });
};

const logoutAndRedirect = async () => {
  await authStore.logout();
  router.push("/login");
};

onMounted(() => {
  fetchFolders();
  fetchBookmarks();
});
</script>

<template>
  <div class="px-6 pt-8">
    <SearchBar class="w-full" />
  </div>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Your Profile</h1>

    <!-- Folder Creation Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Manage Folders</h2>
      <div class="flex gap-4">
        <input
          v-model="newFolderName"
          placeholder="New folder name"
          class="p-2 border rounded flex-grow"
        />
        <button
          @click="createFolder"
          class="px-4 py-2 bg-blue-500 text-black rounded"
        >
          Create Folder
        </button>
      </div>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>

    <!-- Folders List -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Your Folders</h3>
      <div v-if="folders.length === 0" class="text-gray-500">
        No folders created yet.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded"
        >
          <span>{{ folder.name }} (Avg Rating : {{ folder.avg_rating.toFixed(1) || 'N/A' }})</span>
          <div class="flex gap-2">
            <button
              @click="renameFolder(folder.id, folder.name)"
              class="px-2 py-1 text-sm bg-yellow-500 text-black rounded"
            >
              Rename
            </button>
            <button
              @click="deleteFolder(folder.id)"
              class="px-2 py-1 text-sm bg-red-500 text-black rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bookmarks Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Your Bookmarks</h2>
      <div v-if="bookmarks.length === 0" class="text-gray-500">
        No bookmarks yet.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="folder in bookmarks"
          :key="folder.folderId"
          class="bg-white p-4 rounded shadow"
        >
          <h3 class="font-semibold mb-2">
            {{ folder.folderName }} (Avg Rating : {{ folder.avg_rating.toFixed(1) || 'N/A' }})
          </h3>
          <div class="space-y-2">
            <div
              v-for="bm in folder.bookmarks"
              :key="bm.recipeId"
              class="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div class="flex items-center gap-4">
                <img
                  v-if="bm.image && bm.image !== 'character(0'"
                  :src="bm.image"
                  class="w-16 h-16 object-cover rounded"
                />
                <img
                  v-else
                  src="../assets/noImg.jpg"
                  class="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p class="font-medium">{{ bm.recipeName }}</p>
                  <p v-if="bm.rating" class="text-yellow-500">
                    ★ {{ bm.rating }}
                  </p>
                </div>
              </div>
              <div>
                <div class="flex gap-2">
                  <div class="flex flex-col items-end">
                    <button
                      @click="toggleEditRating(bm.recipeId, bm.rating)"
                      class="px-2 py-1 text-sm bg-yellow-500 text-black rounded"
                    >
                      <p class="text-sm">Edit Rating</p>
                    </button>
                  </div>
                  <button
                    @click="removeBookmark(folder.folderId, bm.recipeId)"
                    class="px-2 py-1 text-sm bg-red-500 text-black rounded"
                  >
                    <p class="text-sm">Remove</p>
                  </button>
                </div>
                <!-- Star rating editor appears below the button -->
                <div
                  v-if="editingBookmark === bm.recipeId"
                  class="mt-2 flex gap-1"
                >
                  <span
                    v-for="star in 5"
                    :key="star"
                    @click="setRating(star); updateBookmarkRating(folder.folderId, bm.recipeId)"
                    class="cursor-pointer text-xl"
                    :class="
                      star <= tempRating ? 'text-yellow-400' : 'text-gray-300'
                    "
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations Section -->
          <button
            @click="getSuggestions(folder.folderId)"
            :disabled="folder.bookmarks.length === 0"
            class="mt-4 px-4 py-2 bg-green-500 text-black rounded"
          >
            Get Suggestions
          </button>
          <div v-if="recommendations[folder.folderId]" class="mt-4">
            <h4 class="font-semibold mb-2">Recommendations:</h4>
            <div
              v-for="rec in recommendations[folder.folderId]"
              :key="rec.id"
              @click="showRecipeDetail(rec.id)"
              class="flex items-center gap-4 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
            >
              <img
                v-if="
                  rec.images &&
                  rec.images[0] &&
                  rec.images[0] !== 'character(0'
                "
                :src="rec.images[0]"
                class="w-16 h-16 object-cover rounded"
              />
              <img
                v-else
                src="../assets/noImg.jpg"
                class="w-16 h-16 object-cover rounded"
              />
              <div>
                <p class="font-medium">{{ rec.name }}</p>
                <p class="text-sm text-gray-600">{{ rec.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div
      v-if="$route.query.recipe"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="router.replace({ query: {} })"
    >
      <RecipeDetailModal />
    </div>

    <!-- Logout Button -->
    <div class="mt-8">
      <button @click="logoutAndRedirect" class="px-4 py-2 bg-red-500 text-black rounded">
  Logout
</button>
    </div>
  </div>
</template>