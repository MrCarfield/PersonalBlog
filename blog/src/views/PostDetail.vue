<template>
  <div v-if="post" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <router-link 
      to="/" 
      class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
    >
      <ArrowLeft class="w-4 h-4 mr-1" />
      返回首页
    </router-link>

    <!-- Article Header -->
    <article 
      class="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
      :style="backgroundStore.hasBackground ? backgroundStore.contentStyle : {}"
    >
      <div class="p-6 md:p-10">
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <router-link
            v-for="tag in post.tags" 
            :key="tag"
            :to="`/tag/${tag}`"
            class="px-3 py-1 text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            {{ tag }}
          </router-link>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ post.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <span class="flex items-center space-x-1">
            <Calendar class="w-4 h-4" />
            <span>{{ formatDate(post.date) }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <Eye class="w-4 h-4" />
            <span>{{ post.views }} 阅读</span>
          </span>
          <span class="flex items-center space-x-1">
            <MessageCircle class="w-4 h-4" />
            <span>{{ comments.length }} 评论</span>
          </span>
        </div>

        <!-- Content -->
        <div class="prose max-w-none text-gray-800 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-code:text-gray-800 prose-code:bg-gray-100" v-html="renderedContent"></div>
      </div>
    </article>

    <!-- Navigation -->
    <div class="flex justify-between items-center mt-8">
      <router-link
        v-if="adjacentPosts.prev"
        :to="`/post/${adjacentPosts.prev.id}`"
        class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        <div class="text-left">
          <div class="text-xs text-gray-400">上一篇</div>
          <div class="font-medium truncate max-w-[200px]">{{ adjacentPosts.prev.title }}</div>
        </div>
      </router-link>
      <div v-else></div>

      <router-link
        v-if="adjacentPosts.next"
        :to="`/post/${adjacentPosts.next.id}`"
        class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
      >
        <div class="text-right">
          <div class="text-xs text-gray-400">下一篇</div>
          <div class="font-medium truncate max-w-[200px]">{{ adjacentPosts.next.title }}</div>
        </div>
        <ArrowRight class="w-4 h-4 ml-2" />
      </router-link>
    </div>

    <!-- Comments Section -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        评论 ({{ comments.length }})
      </h2>

      <!-- Comment Form -->
      <div 
        class="rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
        :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
        :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称</label>
            <input
              v-model="newComment.name"
              type="text"
              placeholder="请输入你的昵称"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">评论内容</label>
            <textarea
              v-model="newComment.content"
              rows="3"
              placeholder="写下你的想法..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            ></textarea>
          </div>
          <button
            @click="submitComment"
            :disabled="!newComment.name || !newComment.content"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            发表评论
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length > 0" class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
          :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
        >
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <User class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900 dark:text-white">{{ comment.author }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(comment.date) }}</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Comments -->
      <div 
        v-else 
        class="text-center py-12 rounded-xl border border-gray-200 dark:border-gray-700"
        :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
        :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
      >
        <MessageCircle class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p class="text-gray-500 dark:text-gray-400">暂无评论，来发表第一条评论吧！</p>
      </div>
    </section>
  </div>

  <!-- Not Found -->
  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <FileQuestion class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-6">抱歉，你访问的文章不存在或已被删除</p>
    <router-link to="/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
      <Home class="w-4 h-4 mr-2" />
      返回首页
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, ArrowRight, Calendar, Eye, MessageCircle, 
  User, Home, FileQuestion 
} from 'lucide-vue-next'
import { usePostsStore } from '../stores/posts'
import { useBackgroundStore } from '../stores/background.js'

const route = useRoute()
const postsStore = usePostsStore()
const backgroundStore = useBackgroundStore()

const post = computed(() => postsStore.getPostById(route.params.id))
const adjacentPosts = computed(() => postsStore.getAdjacentPosts(route.params.id))

const comments = ref([])
const newComment = ref({
  name: '',
  content: ''
})

// Simple markdown-like rendering
const renderedContent = computed(() => {
  if (!post.value) return ''
  
  let content = post.value.content
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-8">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-6">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>')
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Line breaks
    .replace(/\n/g, '<br>')
  
  return '<p class="mb-4">' + content + '</p>'
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadComments = async () => {
  comments.value = await postsStore.getComments(route.params.id)
}

const submitComment = async () => {
  if (!newComment.value.name || !newComment.value.content) return
  
  const comment = {
    author: newComment.value.name,
    content: newComment.value.content
  }
  
  try {
    await postsStore.addComment(route.params.id, comment)
    await loadComments()
    
    // Reset form
    newComment.value.name = ''
    newComment.value.content = ''
  } catch (err) {
    alert('评论发表失败，请重试')
  }
}

onMounted(async () => {
  await postsStore.initPosts()
  if (post.value) {
    postsStore.incrementViews(route.params.id)
    await loadComments()
  }
})

watch(() => route.params.id, async () => {
  if (post.value) {
    await loadComments()
  }
})
</script>
