<!-- Profile.vue -->
<script setup>
import { ref, onMounted } from "vue";
import api from "../config/api";
import SearchBar from "./component/Searchbar.vue";
import { useAuthStore } from '../stores/auth'; // Import the auth store

const folders = ref([]);
const newFolderName = ref("");
const bookmarks = ref([]);
const error = ref("");
const authStore = useAuthStore(); // Initialize the auth store

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
  const newName = prompt('Enter new name:', currentName);
  if (newName !== null && newName.trim() !== '') {
    await updateFolder(folderId, newName.trim());
  }
};

const fetchBookmarks = async () => {
  try {
    const { data } = await api.get("/user/bookmarks");
    bookmarks.value = data;
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to load bookmarks.";
  }
};

const updateBookmarkRating = async (folderId, recipeId, currentRating) => {
  const newRating = prompt('Enter new rating (1-5):', currentRating);
  if (newRating !== null && newRating >= 1 && newRating <= 5) {
    try {
      await api.put(`/user/bookmarks/${folderId}/${recipeId}`, { rating: Number(newRating) });
      await fetchBookmarks();
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to update rating.";
    }
  }
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

    <!-- Folder Creation -->
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
          <span>{{ folder.name }}</span>
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

    <!-- Bookmarks -->
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
          <h3 class="font-semibold mb-2">{{ folder.folderName }}</h3>
          <div class="space-y-2">
            <div
              v-for="bm in folder.bookmarks"
              :key="bm.recipeId"
              class="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div class="flex items-center gap-4">
                <img
                  v-if="bm.image && bm.image !== 'character(0)'"
                  :src="bm.image"
                  class="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p class="font-medium">{{ bm.recipeName }}</p>
                  <p v-if="bm.rating" class="text-yellow-500">
                    ★ {{ bm.rating }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="updateBookmarkRating(folder.folderId, bm.recipeId, bm.rating)"
                  class="px-2 py-1 text-sm bg-yellow-500 text-black rounded"
                >
                <p class="text-sm">Edit Rating</p>
                  
                </button>
                <button
                  @click="removeBookmark(folder.folderId, bm.recipeId)"
                  class="px-2 py-1 text-sm bg-red-500 text-black rounded"
                >
                <p class="text-sm">Remove</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="mt-8">
      <button @click="authStore.logout" class="px-4 py-2 bg-red-500 text-black rounded">
        Logout
      </button>
    </div>
  </div>
</template>