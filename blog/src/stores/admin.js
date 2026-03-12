import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // 管理员状态
  const isLoggedIn = ref(false)
  const adminPassword = ref('admin123') // 默认密码，可在设置中修改
  
  // 从 localStorage 恢复登录状态
  const initAuth = () => {
    const saved = localStorage.getItem('admin-logged-in')
    if (saved === 'true') {
      isLoggedIn.value = true
    }
    const savedPassword = localStorage.getItem('admin-password')
    if (savedPassword) {
      adminPassword.value = savedPassword
    }
  }
  
  // 登录
  const login = (password) => {
    if (password === adminPassword.value) {
      isLoggedIn.value = true
      localStorage.setItem('admin-logged-in', 'true')
      return { success: true }
    }
    return { success: false, message: '密码错误' }
  }
  
  // 登出
  const logout = () => {
    isLoggedIn.value = false
    localStorage.removeItem('admin-logged-in')
  }
  
  // 修改密码
  const changePassword = (oldPassword, newPassword) => {
    if (oldPassword !== adminPassword.value) {
      return { success: false, message: '原密码错误' }
    }
    adminPassword.value = newPassword
    localStorage.setItem('admin-password', newPassword)
    return { success: true }
  }
  
  return {
    isLoggedIn,
    initAuth,
    login,
    logout,
    changePassword
  }
})
