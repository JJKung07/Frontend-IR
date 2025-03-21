import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import api from '../config/api';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  image?: string;
  // Add other recipe properties
}

interface Suggestion {
  text: string;
  results?: SearchResult[];
  total?: number;
}

export function useSearch() {
  const query: Ref<string> = ref('');
  const results: Ref<SearchResult[]> = ref([]);
  const total: Ref<number> = ref(0);
  const page: Ref<number> = ref(1);
  const size: Ref<number> = ref(10);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');
  const suggestion: Ref<Suggestion | null> = ref(null);

  const totalPages = computed(() => Math.ceil(total.value / size.value));

  const search = async () => {
    if (!query.value.trim()) {
      results.value = [];
      total.value = 0;
      suggestion.value = null;
      return;
    }

    loading.value = true;
    error.value = '';
    
    try {
      const response = await api.get('/search', {
        params: {
          q: query.value,
          page: page.value,
          size: size.value
        }
      });

      results.value = response.data.results;
      total.value = response.data.total;
      suggestion.value = response.data.suggestion;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'An error occurred while searching';
      console.error('Search error:', err);
    } finally {
      loading.value = false;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage;
      search();
    }
  };

  const useSuggestion = () => {
    if (suggestion.value?.text) {
      query.value = suggestion.value.text;
      page.value = 1;
      search();
    }
  };

  // Debounce implementation
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  watch(query, () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      page.value = 1;
      search();
    }, 300);
  });

  return {
    query,
    results,
    total,
    page,
    size,
    loading,
    error,
    suggestion,
    totalPages,
    search,
    handlePageChange,
    useSuggestion
  };
}