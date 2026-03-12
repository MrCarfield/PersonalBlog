<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center overflow-hidden">
            <template v-if="configStore.avatar">
              <img :src="configStore.avatar" alt="avatar" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <span class="text-white font-bold text-lg">{{ configStore.name.charAt(0) }}</span>
            </template>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">{{ configStore.blogTitle }}</span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          
          <!-- Mobile Menu Button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
        <nav class="flex flex-col space-y-2">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            @click="isMobileMenuOpen = false"
            class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'
import { useConfigStore } from '../stores/config.js'

const isMobileMenuOpen = ref(false)
const configStore = useConfigStore()

const navItems = [
  { name: '首页', path: '/' },
  { name: '标签', path: '/tags' },
  { name: '关于我', path: '/about' },
]
</script>
