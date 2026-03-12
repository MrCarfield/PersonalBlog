import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { siteConfig as defaultConfig } from '../config/site.js'
import { configApi } from '../services/api.js'

export const useConfigStore = defineStore('config', () => {
  // Load from localStorage or use default
  const config = ref({ ...defaultConfig })
  
  const initConfig = async () => {
    try {
      // Try to load from API first
      const apiConfig = await configApi.getAll()
      if (apiConfig.site_config) {
        const parsed = JSON.parse(apiConfig.site_config)
        config.value = { ...defaultConfig, ...parsed }
        // Also save to localStorage for offline use
        localStorage.setItem('site-config', JSON.stringify(config.value))
        return
      }
    } catch (err) {
      console.log('API config not available, using localStorage')
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('site-config')
    if (saved) {
      const savedConfig = JSON.parse(saved)
      const mergeSocial = (key) => {
        const savedValue = savedConfig.social?.[key]
        const defaultValue = defaultConfig.social[key]
        return (savedValue && String(savedValue).trim() !== '') ? savedValue : defaultValue
      }
      
      config.value = {
        ...defaultConfig,
        ...savedConfig,
        social: {
          github: mergeSocial('github'),
          twitter: mergeSocial('twitter'),
          email: mergeSocial('email'),
          website: mergeSocial('website'),
        }
      }
    }
  }
  
  const saveConfig = (newConfig) => {
    config.value = { ...config.value, ...newConfig }
    localStorage.setItem('site-config', JSON.stringify(config.value))
  }
  
  // Computed getters for easy access
  const name = computed(() => config.value.name)
  const blogTitle = computed(() => config.value.blogTitle)
  const avatar = computed(() => config.value.avatar)
  const bio = computed(() => config.value.bio)
  const about = computed(() => config.value.about)
  const social = computed(() => config.value.social)
  const skills = computed(() => config.value.skills)
  
  return {
    config,
    initConfig,
    saveConfig,
    name,
    blogTitle,
    avatar,
    bio,
    about,
    social,
    skills
  }
})
