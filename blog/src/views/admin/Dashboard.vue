<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">管理概览</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">文章总数</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.posts }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">标签数量</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.tags }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Tag class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">总阅读量</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.views }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Eye class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">评论总数</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.comments }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <MessageCircle class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快捷操作</h2>
      <div class="flex flex-wrap gap-4">
        <router-link
          to="/admin/posts/new"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          写文章
        </router-link>
        <router-link
          to="/admin/posts"
          class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FileText class="w-4 h-4 mr-2" />
          管理文章
        </router-link>
        <router-link
          to="/admin/comments"
          class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <MessageCircle class="w-4 h-4 mr-2" />
          管理评论
        </router-link>
        <router-link
          to="/admin/profile"
          class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <User class="w-4 h-4 mr-2" />
          编辑资料
        </router-link>
      </div>
    </div>

    <!-- Recent Posts -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">最近文章</h2>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(post.date) }} · {{ post.views }} 阅读 · {{ post.comments }} 评论
            </p>
          </div>
          <router-link
            :to="`/admin/posts/edit/${post.id}`"
            class="text-primary-600 dark:text-primary-400 hover:underline text-sm"
          >
            编辑
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  FileText, Tag, Eye, MessageCircle, Plus, User 
} from 'lucide-vue-next'
import { usePostsStore } from '../../stores/posts.js'
import { commentsApi } from '../../services/api.js'

const postsStore = usePostsStore()
const totalComments = ref(0)

// 加载评论数
onMounted(async () => {
  await postsStore.initPosts()
  // 计算总评论数
  let count = 0
  for (const post of postsStore.posts) {
    try {
      const comments = await commentsApi.getByPostId(post.id)
      count += comments.length
    } catch (err) {
      // ignore
    }
  }
  totalComments.value = count
})

const stats = computed(() => {
  const posts = postsStore.posts
  // Views now include: site visits (each post +1 per visit) + individual post clicks
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
  
  return {
    posts: posts.length,
    tags: postsStore.allTags.length,
    views: totalViews,
    comments: totalComments.value
  }
})

const recentPosts = computed(() => {
  return [...postsStore.posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>
