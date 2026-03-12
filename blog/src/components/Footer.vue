<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <!-- Copyright -->
        <div class="text-gray-600 dark:text-gray-400 text-sm">
          © {{ currentYear }} 我的个人博客. All rights reserved.
        </div>

        <!-- Social Links -->
        <div class="flex items-center space-x-4 mt-4 md:mt-0">
          <a 
            v-for="link in socialLinks" 
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :title="link.name"
          >
            <component :is="link.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { Github, Twitter, Mail, Rss } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com', icon: Github },
  { name: 'Twitter', url: 'https://twitter.com', icon: Twitter },
  { name: 'Email', url: 'mailto:hello@example.com', icon: Mail },
  { name: 'RSS', url: '/rss.xml', icon: Rss },
]
</script>
