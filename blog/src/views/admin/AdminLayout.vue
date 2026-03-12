<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left -->
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Settings class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">管理后台</span>
            </router-link>
          </div>

          <!-- Right -->
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <router-link 
              to="/" 
              class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              查看网站
            </router-link>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut class="w-4 h-4" />
              <span>退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <nav class="space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors"
              :class="$route.path === item.path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  Settings, LogOut, FileText, User, Lock, 
  LayoutDashboard, MessageCircle, Image, Database
} from 'lucide-vue-next'
import ThemeToggle from '../../components/ThemeToggle.vue'
import { useAdminStore } from '../../stores/admin.js'

const router = useRouter()
const adminStore = useAdminStore()

const menuItems = [
  { name: '概览', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/posts', icon: FileText },
  { name: '评论管理', path: '/admin/comments', icon: MessageCircle },
  { name: '个人信息', path: '/admin/profile', icon: User },
  { name: '背景设置', path: '/admin/background', icon: Image },
  { name: '数据库查看', path: '/admin/database', icon: Database },
  { name: '修改密码', path: '/admin/password', icon: Lock },
]

const handleLogout = () => {
  adminStore.logout()
  router.push('/admin/login')
}
</script>
