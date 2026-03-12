<template>
  <article 
    class="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
    :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
    :style="backgroundStore.hasBackground ? backgroundStore.contentStyle : {}"
  >
    <router-link :to="`/post/${post.id}`" class="block p-6 flex flex-col h-full">
      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-2.5 py-0.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 transition-colors line-clamp-2">
        {{ post.title }}
      </h2>

      <!-- Excerpt -->
      <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
        {{ post.excerpt }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center space-x-1">
          <Calendar class="w-4 h-4" />
          <span>{{ formatDate(post.date) }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex items-center space-x-1" title="阅读量">
            <Eye class="w-4 h-4" />
            <span>{{ post.views || 0 }}</span>
          </span>
          <span class="flex items-center space-x-1" title="评论数">
            <MessageCircle class="w-4 h-4" />
            <span>{{ commentCount }}</span>
          </span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Calendar, Eye, MessageCircle } from 'lucide-vue-next'
import { useBackgroundStore } from '../stores/background.js'
import { commentsApi } from '../services/api.js'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const backgroundStore = useBackgroundStore()
const commentCount = ref(0)

// 获取评论数
onMounted(async () => {
  try {
    const comments = await commentsApi.getByPostId(props.post.id)
    commentCount.value = comments.length
  } catch (err) {
    commentCount.value = 0
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
