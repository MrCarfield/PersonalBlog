<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background Layer - Optimized for performance -->
    <template v-if="backgroundStore.backgroundImage">
      <!-- Single background layer with all effects combined -->
      <div
        class="fixed inset-0 z-0"
        :style="backgroundLayerStyle"
      ></div>
      
      <!-- Combined overlay for brightness and dark overlay -->
      <div
        v-if="showOverlay"
        class="fixed inset-0 z-0 pointer-events-none"
        :style="combinedOverlayStyle"
      ></div>
    </template>
    
    <!-- Content Layer -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <Header />
      <main class="flex-1">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useThemeStore } from './stores/theme'
import { useBackgroundStore } from './stores/background'
import { useConfigStore } from './stores/config'
import { onMounted, computed } from 'vue'

const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()
const configStore = useConfigStore()

// Optimized computed styles to prevent recalculation
const backgroundLayerStyle = computed(() => {
  const style = {
    backgroundImage: `url(${backgroundStore.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    willChange: 'transform' // GPU acceleration hint
  }
  
  // Only apply filter if blur is active
  if (backgroundStore.blur > 0) {
    style.filter = `blur(${backgroundStore.blur}px)`
  }
  
  return style
})

const showOverlay = computed(() => {
  return backgroundStore.brightness !== 100 || backgroundStore.overlayOpacity > 0
})

const combinedOverlayStyle = computed(() => {
  const overlays = []
  
  // Brightness overlay
  if (backgroundStore.brightness !== 100) {
    if (backgroundStore.brightness < 100) {
      overlays.push(`rgba(0, 0, 0, ${(100 - backgroundStore.brightness) / 100 * 0.5})`)
    } else {
      overlays.push(`rgba(255, 255, 255, ${(backgroundStore.brightness - 100) / 100 * 0.3})`)
    }
  }
  
  // Dark overlay
  if (backgroundStore.overlayOpacity > 0) {
    overlays.push(`rgba(0, 0, 0, ${backgroundStore.overlayOpacity / 100})`)
  }
  
  return {
    background: overlays.length > 1 
      ? `linear-gradient(${overlays.join(', ')})`
      : overlays[0] || 'transparent'
  }
})

onMounted(async () => {
  themeStore.initTheme()
  await backgroundStore.initBackground()
  await configStore.initConfig()
})
</script>
