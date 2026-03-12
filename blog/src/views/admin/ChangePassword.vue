<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">修改密码</h1>

    <div class="max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <!-- Old Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">原密码</label>
          <div class="relative">
            <input
              v-model="form.oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              @click="showOldPassword = !showOldPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showOldPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新密码</label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showNewPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">密码至少需要 6 个字符</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">确认新密码</label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
          {{ success }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            重置
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            修改密码
          </button>
        </div>
      </form>
    </div>

    <!-- Security Tips -->
    <div class="max-w-md mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
      <h3 class="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2 flex items-center">
        <Shield class="w-4 h-4 mr-2" />
        安全提示
      </h3>
      <ul class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
        <li>• 使用至少 6 位字符的密码</li>
        <li>• 建议包含字母、数字和符号</li>
        <li>• 避免使用常见的密码</li>
        <li>• 定期更换密码以提高安全性</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff, Shield } from 'lucide-vue-next'
import { useAdminStore } from '../../stores/admin.js'

const adminStore = useAdminStore()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const success = ref('')

const handleChangePassword = () => {
  error.value = ''
  success.value = ''

  // Validate
  if (form.value.newPassword.length < 6) {
    error.value = '新密码至少需要 6 个字符'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = '两次输入的新密码不一致'
    return
  }

  // Change password
  const result = adminStore.changePassword(form.value.oldPassword, form.value.newPassword)
  
  if (result.success) {
    success.value = '密码修改成功！请使用新密码登录。'
    resetForm()
  } else {
    error.value = result.message
  }
}

const resetForm = () => {
  form.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  error.value = ''
}
</script>
