<template>
  <button 
    @click="themeStore.toggleTheme"
    class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    :title="themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <Sun v-if="themeStore.isDark" class="w-5 h-5" />
    <Moon v-else class="w-5 h-5" />
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>
