<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ selectedTag ? `标签: ${selectedTag}` : '所有标签' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ selectedTag ? `共 ${filteredPosts.length} 篇文章` : `共 ${allTags.length} 个标签` }}
      </p>
    </div>

    <!-- Tags Cloud (show when no tag selected) -->
    <div v-if="!selectedTag" class="mb-12">
      <div class="flex flex-wrap justify-center gap-3">
        <router-link
          v-for="tag in allTags"
          :key="tag"
          :to="`/tag/${tag}`"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
          :class="getTagClass(tag)"
        >
          {{ tag }}
          <span class="ml-1 opacity-70">({{ getTagCount(tag) }})</span>
        </router-link>
      </div>
    </div>

    <!-- Back to all tags (show when tag selected) -->
    <div v-else class="mb-8 text-center">
      <router-link
        to="/tags"
        class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        查看所有标签
      </router-link>
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
      <Tag class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        该标签下暂无文章
      </h3>
      <router-link
        to="/tags"
        class="text-primary-600 dark:text-primary-400 hover:underline"
      >
        查看其他标签
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Tag } from 'lucide-vue-next'
import PostCard from '../components/PostCard.vue'
import { usePostsStore } from '../stores/posts'

const route = useRoute()
const postsStore = usePostsStore()

const selectedTag = computed(() => route.params.tag || '')
const allTags = computed(() => postsStore.allTags)

const filteredPosts = computed(() => {
  if (selectedTag.value) {
    return postsStore.getPostsByTag(selectedTag.value)
  }
  return postsStore.filteredPosts
})

const getTagCount = (tag) => {
  return postsStore.posts.filter(post => post.tags.includes(tag)).length
}

const getTagClass = (tag) => {
  const count = getTagCount(tag)
  const baseClasses = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400'
  
  if (count >= 5) {
    return `text-base ${baseClasses}`
  } else if (count >= 3) {
    return `text-sm ${baseClasses}`
  }
  return `text-xs ${baseClasses}`
}

watch(() => route.params.tag, (newTag) => {
  postsStore.setSelectedTag(newTag || '')
}, { immediate: true })
</script>
