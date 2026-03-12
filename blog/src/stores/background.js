import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { configApi } from '../services/api.js'

export const useBackgroundStore = defineStore('background', () => {
  // Background settings
  const backgroundImage = ref('')
  const brightness = ref(100) // 0-200%
  const blur = ref(0) // 0-20px
  const overlayOpacity = ref(0) // 0-100%
  const contentOpacity = ref(95) // 0-100%, default 95% for slight transparency
  
  // Initialize from API or localStorage
  const initBackground = async () => {
    try {
      // Try to load from API first
      const apiConfig = await configApi.getAll()
      if (apiConfig.background_config) {
        const config = JSON.parse(apiConfig.background_config)
        backgroundImage.value = config.backgroundImage || ''
        brightness.value = config.brightness ?? 100
        blur.value = config.blur ?? 0
        overlayOpacity.value = config.overlayOpacity ?? 0
        contentOpacity.value = config.contentOpacity ?? 95
        // Also save to localStorage for offline use
        localStorage.setItem('site-background', JSON.stringify(config))
        return
      }
    } catch (err) {
      console.log('API background config not available, using localStorage')
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('site-background')
    if (saved) {
      const config = JSON.parse(saved)
      backgroundImage.value = config.backgroundImage || ''
      brightness.value = config.brightness ?? 100
      blur.value = config.blur ?? 0
      overlayOpacity.value = config.overlayOpacity ?? 0
      contentOpacity.value = config.contentOpacity ?? 95
    }
  }
  
  // Save settings
  const saveBackground = (config) => {
    // Use 'in' operator to check if key exists, allowing empty strings and 0 values
    if ('backgroundImage' in config) backgroundImage.value = config.backgroundImage
    if ('brightness' in config) brightness.value = config.brightness
    if ('blur' in config) blur.value = config.blur
    if ('overlayOpacity' in config) overlayOpacity.value = config.overlayOpacity
    if ('contentOpacity' in config) contentOpacity.value = config.contentOpacity
    
    localStorage.setItem('site-background', JSON.stringify({
      backgroundImage: backgroundImage.value,
      brightness: brightness.value,
      blur: blur.value,
      overlayOpacity: overlayOpacity.value,
      contentOpacity: contentOpacity.value
    }))
  }
  
  // Reset to default
  const resetBackground = () => {
    backgroundImage.value = ''
    brightness.value = 100
    blur.value = 0
    overlayOpacity.value = 0
    contentOpacity.value = 95
    localStorage.removeItem('site-background')
  }
  
  // Check if blur is active
  const isBlurActive = computed(() => blur.value > 0)
  
  // Computed style for overlay
  const overlayStyle = computed(() => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${overlayOpacity.value / 100})`,
    }
  })
  
  // Pre-computed opacity values to avoid repeated calculations
  // contentOpacity is the opacity percentage (50-100), we need to convert to alpha for rgba
  const opacityDecimal = computed(() => contentOpacity.value / 100)
  
  // Computed style for content transparency - cached
  // Use higher opacity for better readability (min 0.85)
  const contentStyle = computed(() => {
    const alpha = Math.max(opacityDecimal.value, 0.85)
    return {
      backgroundColor: `rgba(255, 255, 255, ${alpha})`,
    }
  })
  
  // Dark mode content style - cached
  const darkContentStyle = computed(() => {
    const alpha = Math.max(opacityDecimal.value, 0.85)
    return {
      backgroundColor: `rgba(31, 41, 55, ${alpha})`,
    }
  })
  
  // Check if background is enabled (for v-if conditions)
  const hasBackground = computed(() => !!backgroundImage.value)
  
  return {
    backgroundImage,
    brightness,
    blur,
    overlayOpacity,
    contentOpacity,
    isBlurActive,
    hasBackground,
    opacityDecimal,
    initBackground,
    saveBackground,
    resetBackground,
    overlayStyle,
    contentStyle,
    darkContentStyle
  }
})
