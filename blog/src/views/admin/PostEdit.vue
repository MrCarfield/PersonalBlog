<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ isEditing ? '编辑文章' : '写文章' }}
      </h1>
      <div class="flex items-center space-x-3">
        <button
          @click="saveDraft"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          保存草稿
        </button>
        <button
          @click="publishPost"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {{ isEditing ? '更新' : '发布' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Editor -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
          <input
            v-model="post.title"
            type="text"
            placeholder="输入文章标题..."
            class="w-full px-4 py-3 text-lg font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">摘要</label>
          <textarea
            v-model="post.excerpt"
            rows="2"
            placeholder="输入文章摘要..."
            class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          ></textarea>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            内容 (支持 Markdown 语法)
          </label>
          <textarea
            v-model="post.content"
            rows="20"
            placeholder="输入文章内容..."
            class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Tags -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(tag, index) in post.tags"
              :key="index"
              class="inline-flex items-center px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-sm"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="ml-1 hover:text-red-500">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="newTag"
              type="text"
              placeholder="添加标签"
              class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @keyup.enter="addTag"
            />
            <button
              @click="addTag"
              class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Date -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">发布日期</label>
          <input
            v-model="post.date"
            type="date"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Preview -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">预览</h3>
          <div class="prose dark:prose-invert max-w-none text-sm">
            <h4 class="font-semibold">{{ post.title || '无标题' }}</h4>
            <p class="text-gray-500">{{ post.excerpt || '无摘要' }}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Help -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Markdown 提示</h3>
          <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <li># 标题 - 一级标题</li>
            <li>## 标题 - 二级标题</li>
            <li>**粗体** - 粗体文字</li>
            <li>`代码` - 行内代码</li>
            <li>```代码块``` - 代码块</li>
            <li>- 列表项 - 无序列表</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
    >
      <Check class="w-5 h-5" />
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, X, Check } from 'lucide-vue-next'
import { usePostsStore } from '../../stores/posts.js'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()

const isEditing = computed(() => !!route.params.id)

const post = ref({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  date: new Date().toISOString().split('T')[0],
  views: 0,
  comments: 0
})

const newTag = ref('')
const showSuccess = ref(false)
const successMessage = ref('')

onMounted(async () => {
  await postsStore.initPosts()
  if (isEditing.value) {
    const existingPost = postsStore.getPostById(route.params.id)
    if (existingPost) {
      post.value = { ...existingPost }
    }
  }
})

const addTag = () => {
  if (newTag.value.trim() && !post.value.tags.includes(newTag.value.trim())) {
    post.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  post.value.tags.splice(index, 1)
}

const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const saveDraft = () => {
  showSuccessMessage('草稿已保存')
}

const publishPost = async () => {
  if (!post.value.title.trim()) {
    alert('请输入文章标题')
    return
  }

  try {
    const postData = {
      title: post.value.title,
      excerpt: post.value.excerpt,
      content: post.value.content,
      tags: post.value.tags
    }

    if (isEditing.value) {
      await postsStore.updatePost(post.value.id, postData)
      showSuccessMessage('文章已更新')
    } else {
      await postsStore.createPost(postData)
      showSuccessMessage('文章已发布')
    }
    
    setTimeout(() => {
      router.push('/admin/posts')
    }, 1500)
  } catch (err) {
    alert('保存失败：' + err.message)
  }
}
</script>
