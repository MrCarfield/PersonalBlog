<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">数据库查看</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      <button @click="loadData" class="mt-2 text-sm text-primary-600 hover:underline">重试</button>
    </div>

    <!-- 数据展示 -->
    <div v-else class="space-y-6">
      <!-- 表选择器 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="table in tableNames"
            :key="table.key"
            @click="currentTable = table.key"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="currentTable === table.key 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ table.name }}
            <span class="ml-2 text-xs opacity-75">({{ getTableCount(table.key) }})</span>
          </button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ getCurrentTableName() }}
          </h2>
          <button 
            @click="loadData"
            class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            刷新数据
          </button>
        </div>

        <div class="overflow-x-auto">
          <table v-if="currentData.length > 0" class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th 
                  v-for="col in getColumns()" 
                  :key="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="(row, index) in currentData" 
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td 
                  v-for="col in getColumns()" 
                  :key="col"
                  class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300"
                >
                  <template v-if="isLongText(row[col])">
                    <div class="max-w-xs">
                      <div v-if="expandedCells[`${index}-${col}`]" class="whitespace-pre-wrap">
                        {{ formatValue(row[col]) }}
                        <button 
                          @click="expandedCells[`${index}-${col}`] = false"
                          class="text-primary-600 text-xs ml-2"
                        >
                          收起
                        </button>
                      </div>
                      <div v-else>
                        {{ truncateText(formatValue(row[col]), 50) }}
                        <button 
                          @click="expandedCells[`${index}-${col}`] = true"
                          class="text-primary-600 text-xs ml-2"
                        >
                          展开
                        </button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    {{ formatValue(row[col]) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无数据
          </div>
        </div>
      </div>

      <!-- JSON 预览 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">JSON 预览</h2>
        </div>
        <div class="p-4">
          <pre class="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">{{ JSON.stringify(currentData.slice(0, 2), null, 2) }}</pre>
          <p v-if="currentData.length > 2" class="text-sm text-gray-500 mt-2">
            ... 还有 {{ currentData.length - 2 }} 条数据
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dbApi } from '../../services/api.js'

const loading = ref(false)
const error = ref('')
const tables = ref({
  posts: [],
  comments: [],
  configs: [],
  admins: []
})
const currentTable = ref('posts')
const expandedCells = ref({})

const tableNames = [
  { key: 'posts', name: '文章' },
  { key: 'comments', name: '评论' },
  { key: 'configs', name: '配置' },
  { key: 'admins', name: '管理员' }
]

const currentData = computed(() => {
  return tables.value[currentTable.value] || []
})

const getTableCount = (key) => {
  return tables.value[key]?.length || 0
}

const getCurrentTableName = () => {
  return tableNames.find(t => t.key === currentTable.value)?.name || ''
}

const getColumns = () => {
  if (currentData.value.length === 0) return []
  return Object.keys(currentData.value[0])
}

const formatValue = (val) => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

const isLongText = (val) => {
  if (val === null || val === undefined) return false
  const str = String(val)
  return str.length > 50 || str.includes('\n')
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await dbApi.getTables()
    tables.value = data
  } catch (err) {
    error.value = '加载失败：' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
