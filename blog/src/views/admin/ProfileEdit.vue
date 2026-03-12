<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">编辑个人信息</h1>



    <div class="max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Avatar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">头像</label>
          <div class="flex items-center space-x-4">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              <template v-if="avatarPreview">
                <img :src="avatarPreview" alt="avatar" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                {{ form.name.charAt(0) || '?' }}
              </template>
            </div>
            <div class="flex-1">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Upload class="w-4 h-4 inline mr-1" />
                  选择图片
                </button>
                <button
                  v-if="avatarPreview"
                  type="button"
                  @click="removeAvatar"
                  class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X class="w-4 h-4 inline mr-1" />
                  移除
                </button>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                支持 JPG、PNG、GIF 格式，图片会被转为 Base64 存储
              </p>
            </div>
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">名字 *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="你的名字"
            class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Blog Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">博客标题</label>
          <input
            v-model="form.blogTitle"
            type="text"
            placeholder="我的博客"
            class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人简介</label>
          <input
            v-model="form.bio"
            type="text"
            placeholder="简短的个人介绍"
            class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- About Paragraphs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">详细自我介绍</label>
          <div class="space-y-2">
            <textarea
              v-for="(paragraph, index) in form.about.paragraphs"
              :key="index"
              v-model="form.about.paragraphs[index]"
              rows="3"
              :placeholder="`第 ${index + 1} 段介绍`"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            ></textarea>
          </div>
          <button
            type="button"
            @click="addParagraph"
            class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            + 添加段落
          </button>
        </div>

        <!-- Social Links -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">社交链接</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
              <input
                v-model="form.social.github"
                type="url"
                placeholder="https://github.com/用户名"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter</label>
              <input
                v-model="form.social.twitter"
                type="url"
                placeholder="https://twitter.com/用户名"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱</label>
              <input
                v-model="form.social.email"
                type="text"
                placeholder="mailto:邮箱@example.com"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人网站</label>
              <input
                v-model="form.social.website"
                type="url"
                placeholder="https://example.com"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">技术栈</h3>
          <div class="space-y-2">
            <div
              v-for="(skill, index) in form.skills"
              :key="index"
              class="flex items-center space-x-2"
            >
              <input
                v-model="skill.name"
                type="text"
                placeholder="技术名称"
                class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                v-model="skill.color"
                class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="bg-green-500">绿色</option>
                <option value="bg-blue-500">蓝色</option>
                <option value="bg-yellow-500">黄色</option>
                <option value="bg-red-500">红色</option>
                <option value="bg-purple-500">紫色</option>
                <option value="bg-pink-500">粉色</option>
                <option value="bg-cyan-500">青色</option>
                <option value="bg-orange-500">橙色</option>
              </select>
              <button
                type="button"
                @click="removeSkill(index)"
                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addSkill"
            class="mt-2 inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Plus class="w-4 h-4 mr-1" />
            添加技术
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="resetForm"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            重置
          </button>
          <div class="flex items-center space-x-3">
            <span v-if="saved" class="text-green-600 flex items-center">
              <Check class="w-4 h-4 mr-1" />
              已保存
            </span>
            <button
              type="submit"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              保存修改
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Trash2, Check, Upload, X } from 'lucide-vue-next'
import { useConfigStore } from '../../stores/config.js'
import { siteConfig } from '../../config/site.js'
import { configApi } from '../../services/api.js'

const configStore = useConfigStore()

const form = ref({
  name: '',
  blogTitle: '',
  avatar: '',
  bio: '',
  about: { paragraphs: [''] },
  social: {
    github: '',
    twitter: '',
    email: '',
    website: ''
  },
  skills: []
})

const saved = ref(false)
const avatarPreview = ref('')
const fileInput = ref(null)

onMounted(async () => {
  // Load current config from store
  await configStore.initConfig()
  form.value = JSON.parse(JSON.stringify(configStore.config))
  avatarPreview.value = configStore.config.avatar || ''
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // Check file size (max 1MB)
  if (file.size > 1 * 1024 * 1024) {
    alert('图片大小不能超过 1MB')
    return
  }

  // Read file directly
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
    form.value.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}



const removeAvatar = () => {
  avatarPreview.value = ''
  form.value.avatar = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addParagraph = () => {
  form.value.about.paragraphs.push('')
}

const addSkill = () => {
  form.value.skills.push({ name: '', color: 'bg-blue-500' })
}

const removeSkill = (index) => {
  form.value.skills.splice(index, 1)
}

const saveProfile = async () => {
  try {
    // Save to backend API
    await configApi.update('site_config', JSON.stringify(form.value))
    
    // Also save to local store for reactive updates
    configStore.saveConfig(form.value)
    
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 3000)
  } catch (err) {
    alert('保存失败：' + err.message)
  }
}

const resetForm = () => {
  if (confirm('确定要重置所有修改吗？')) {
    form.value = JSON.parse(JSON.stringify(configStore.config))
    avatarPreview.value = configStore.config.avatar || ''
  }
}
</script>
