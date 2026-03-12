<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <section class="text-center py-12 md:py-20">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        欢迎来到我的博客
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        分享技术心得、学习笔记和生活感悟
      </p>
    </section>

    <!-- Search Bar -->
    <div class="max-w-xl mx-auto mb-10">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
          :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-if="filteredPosts.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <FileSearch class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        没有找到相关文章
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        尝试使用其他关键词搜索
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Search, X, FileSearch } from 'lucide-vue-next'
import PostCard from '../components/PostCard.vue'
import { usePostsStore } from '../stores/posts'
import { useBackgroundStore } from '../stores/background.js'

const postsStore = usePostsStore()
const backgroundStore = useBackgroundStore()
const searchQuery = ref('')

// Load posts from API when entering the website
onMounted(async () => {
  await postsStore.initPosts()
  postsStore.addSiteVisit()
})

const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    return postsStore.filteredPosts
  }
  
  const query = searchQuery.value.toLowerCase()
  return postsStore.posts.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))
})

watch(searchQuery, (newValue) => {
  postsStore.setSearchQuery(newValue)
})
</script>
