<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h1>
      <router-link
        to="/admin/posts/new"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        写文章
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>

    <!-- Posts Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">标题</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">标签</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">日期</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">数据</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900 dark:text-white">{{ post.title }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{{ post.excerpt }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(post.date) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-3">
                <span class="flex items-center" title="阅读">
                  <Eye class="w-4 h-4 mr-1" /> {{ post.views || 0 }}
                </span>
                <span class="flex items-center" title="评论">
                  <MessageCircle class="w-4 h-4 mr-1" /> {{ commentCounts[post.id] || 0 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <router-link
                  :to="`/post/${post.id}`"
                  target="_blank"
                  class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="查看"
                >
                  <Eye class="w-4 h-4" />
                </router-link>
                <router-link
                  :to="`/admin/posts/edit/${post.id}`"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="编辑"
                >
                  <Edit class="w-4 h-4" />
                </router-link>
                <button
                  @click="confirmDelete(post)"
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
      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <FileText class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p class="text-gray-500 dark:text-gray-400">没有找到文章</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">确认删除</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          确定要删除文章 "{{ postToDelete?.title }}" 吗？此操作无法撤销。
        </p>
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
import { Plus, Search, Eye, MessageCircle, Edit, Trash2, FileText } from 'lucide-vue-next'
import { usePostsStore } from '../../stores/posts.js'

const postsStore = usePostsStore()
const searchQuery = ref('')
const showDeleteModal = ref(false)
const postToDelete = ref(null)
const commentCounts = ref({})

// 加载文章和评论数
onMounted(async () => {
  await postsStore.initPosts()
  // 加载每篇文章的评论数
  for (const post of postsStore.posts) {
    commentCounts.value[post.id] = await postsStore.getActualCommentCount(post.id)
  }
})

const filteredPosts = computed(() => {
  let posts = [...postsStore.posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query))
    )
  }
  
  return posts
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const confirmDelete = (post) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (postToDelete.value) {
    try {
      await postsStore.deletePost(postToDelete.value.id)
    } catch (err) {
      alert('删除失败：' + err.message)
    }
  }
  showDeleteModal.value = false
  postToDelete.value = null
}
</script>
