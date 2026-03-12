<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Profile Header -->
    <div class="text-center mb-12">
      <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
        <template v-if="configStore.avatar">
          <img :src="configStore.avatar" alt="avatar" class="w-full h-full object-cover" />
        </template>
        <template v-else>
          {{ configStore.name.charAt(0) }}
        </template>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {{ configStore.name }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ configStore.bio }}
      </p>
    </div>

    <!-- Bio Section -->
    <section 
      class="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8"
      :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
      :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <User class="w-6 h-6 mr-2 text-primary-600" />
        个人简介
      </h2>
      <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p v-for="(paragraph, index) in (configStore.about?.paragraphs || [])" :key="index" class="mb-4">
          {{ paragraph }}
        </p>
      </div>
    </section>

    <!-- Skills Section -->
    <section 
      class="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8"
      :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
      :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Code class="w-6 h-6 mr-2 text-primary-600" />
        技术栈
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900"
        >
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            :class="skill.color"
          >
            <component :is="skill.icon" class="w-5 h-5" />
          </div>
          <span class="font-medium text-gray-900 dark:text-white">{{ skill.name }}</span>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section 
      class="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8"
      :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
      :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <BarChart3 class="w-6 h-6 mr-2 text-primary-600" />
        博客数据
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
          <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">{{ stats.posts }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">文章总数</div>
        </div>
        <div class="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{{ stats.tags }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">标签数量</div>
        </div>
        <div class="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{{ stats.views }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">总阅读量</div>
        </div>
        <div class="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{{ stats.comments }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">评论总数</div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section 
      class="rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      :class="backgroundStore.hasBackground ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm' : 'bg-white dark:bg-gray-800'"
      :style="backgroundStore.hasBackground ? { backgroundColor: `rgba(255, 255, 255, ${backgroundStore.opacityDecimal})` } : {}"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Mail class="w-6 h-6 mr-2 text-primary-600" />
        联系方式
      </h2>
      
      <div v-if="contacts.length > 0" class="flex flex-wrap gap-4">
        <a
          v-for="contact in contacts"
          :key="contact.name"
          :href="contact.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          <component :is="contact.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span class="text-gray-700 dark:text-gray-300">{{ contact.name }}</span>
        </a>
      </div>
      <p v-else class="text-gray-500 dark:text-gray-400">
        暂无联系方式，请在管理员后台配置
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  User, Code, BarChart3, Mail, 
  Github, Twitter, Mail as MailIcon, 
  Globe
} from 'lucide-vue-next'
import { usePostsStore } from '../stores/posts'
import { useConfigStore } from '../stores/config.js'
import { useBackgroundStore } from '../stores/background.js'

const postsStore = usePostsStore()
const configStore = useConfigStore()
const backgroundStore = useBackgroundStore()

const skills = computed(() => {
  return (configStore.skills || []).map(skill => ({
    ...skill,
    icon: Code
  }))
})

const stats = computed(() => {
  const posts = postsStore.posts
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
  // Calculate actual comment count from localStorage
  const totalComments = posts.reduce((sum, post) => {
    return sum + postsStore.getActualCommentCount(post.id)
  }, 0)
  
  return {
    posts: posts.length,
    tags: postsStore.allTags.length,
    views: totalViews,
    comments: totalComments
  }
})

const contacts = computed(() => {
  const social = configStore.social || {}
  console.log('Social config:', social)
  
  // Helper to validate URL
  const isValidUrl = (url) => {
    if (!url || String(url).trim() === '') return false
    const str = String(url).trim()
    // Must start with http://, https://, or mailto:
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('mailto:')
  }
  
  const list = [
    { name: 'GitHub', url: social.github, icon: Github },
    { name: 'Twitter', url: social.twitter, icon: Twitter },
    { name: 'Email', url: social.email ? `mailto:${social.email}` : null, icon: MailIcon },
    { name: 'Website', url: social.website, icon: Globe },
  ].filter(c => isValidUrl(c.url))
  console.log('Contacts:', list)
  return list
})
</script>
