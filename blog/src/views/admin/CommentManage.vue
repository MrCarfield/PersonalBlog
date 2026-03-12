<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">评论管理</h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">总评论数</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ totalComments }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <MessageCircle class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">有评论的文章</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ postsWithComments }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">今日评论</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ todayComments }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索评论内容或作者..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <select
        v-model="filterPost"
        class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">所有文章</option>
        <option v-for="post in postsStore.posts" :key="post.id" :value="post.id">
          {{ post.title }}
        </option>
      </select>
    </div>

    <!-- Comments List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">评论内容</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">作者</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">文章</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">时间</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="comment in filteredComments" :key="comment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-6 py-4">
              <p class="text-gray-900 dark:text-white line-clamp-2">{{ comment.content }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-2">
                  <User class="w-4 h-4 text-primary-600" />
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.author }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <router-link
                :to="`/post/${comment.postId}`"
                target="_blank"
                class="text-sm text-primary-600 dark:text-primary-400 hover:underline line-clamp-1"
              >
                {{ comment.postTitle }}
              </router-link>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(comment.date) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <router-link
                  :to="`/post/${comment.postId}`"
                  target="_blank"
                  class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="查看"
                >
                  <Eye class="w-4 h-4" />
                </router-link>
                <button
                  @click="confirmDelete(comment)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="删除"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredComments.length === 0" class="text-center py-12">
        <MessageCircle class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p class="text-gray-500 dark:text-gray-400">没有找到评论</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">确认删除</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          确定要删除这条评论吗？此操作无法撤销。
        </p>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6">
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {{ commentToDelete?.content }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            — {{ commentToDelete?.author }}
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  MessageCircle, FileText, Calendar, Search, 
  Eye, Trash2, User 
} from 'lucide-vue-next'
import { usePostsStore } from '../../stores/posts.js'

const postsStore = usePostsStore()
const searchQuery = ref('')
const filterPost = ref('')
const showDeleteModal = ref(false)
const commentToDelete = ref(null)
const comments = ref([])

// Load comments from API
onMounted(async () => {
  await postsStore.initPosts()
  comments.value = await postsStore.getAllComments()
})

// Get all comments
const allComments = computed(() => comments.value)

// Filtered comments
const filteredComments = computed(() => {
  let comments = allComments.value
  
  // Filter by post
  if (filterPost.value) {
    comments = comments.filter(c => c.postId === filterPost.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    comments = comments.filter(c => 
      c.content.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query)
    )
  }
  
  return comments
})

// Stats
const totalComments = computed(() => allComments.value.length)

const postsWithComments = computed(() => {
  const postIds = new Set(allComments.value.map(c => c.postId))
  return postIds.size
})

const todayComments = computed(() => {
  const today = new Date().toDateString()
  return allComments.value.filter(c => new Date(c.date).toDateString() === today).length
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // Less than 1 hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes < 1 ? '刚刚' : `${minutes} 分钟前`
  }
  
  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours} 小时前`
  }
  
  // Less than 7 days
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} 天前`
  }
  
  return date.toLocaleDateString('zh-CN')
}

const confirmDelete = (comment) => {
  commentToDelete.value = comment
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (commentToDelete.value) {
    try {
      await postsStore.deleteComment(commentToDelete.value.postId, commentToDelete.value.id)
      // Refresh comments
      comments.value = await postsStore.getAllComments()
    } catch (err) {
      alert('删除失败：' + err.message)
    }
  }
  showDeleteModal.value = false
  commentToDelete.value = null
}
</script>
