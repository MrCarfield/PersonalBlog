<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">背景设置</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Settings Panel -->
      <div class="space-y-6">
        <!-- Background Image -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">背景图片</h2>
          
          <!-- Preview -->
          <div class="mb-4">
            <div 
              class="w-full h-48 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
              :style="previewStyle"
            >
              <template v-if="!form.backgroundImage">
                <div class="text-center text-gray-400">
                  <ImageIcon class="w-12 h-12 mx-auto mb-2" />
                  <p>暂无背景图片</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Upload -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <div class="flex space-x-3">
            <button
              @click="$refs.fileInput.click()"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <Upload class="w-4 h-4 mr-2" />
              上传图片
            </button>
            <button
              v-if="form.backgroundImage"
              @click="removeBackground"
              class="px-4 py-2 text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            支持 JPG、PNG 格式，上传后可裁剪选择背景区域
          </p>
        </div>

        <!-- Adjustments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">效果调节</h2>
          
          <!-- Brightness -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">亮度</label>
              <span class="text-sm text-gray-500">{{ form.brightness }}%</span>
            </div>
            <input
              v-model.number="form.brightness"
              type="range"
              min="20"
              max="200"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>暗</span>
              <span>正常</span>
              <span>亮</span>
            </div>
          </div>

          <!-- Blur -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">模糊度</label>
              <span class="text-sm text-gray-500">{{ form.blur }}px</span>
            </div>
            <input
              v-model.number="form.blur"
              type="range"
              min="0"
              max="20"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>清晰</span>
              <span>模糊</span>
            </div>
          </div>

          <!-- Overlay Opacity -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">遮罩暗度</label>
              <span class="text-sm text-gray-500">{{ form.overlayOpacity }}%</span>
            </div>
            <input
              v-model.number="form.overlayOpacity"
              type="range"
              min="0"
              max="80"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>透明</span>
              <span>深色</span>
            </div>
          </div>

          <!-- Content Opacity -->
          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">内容框透明度</label>
              <span class="text-sm text-gray-500">{{ form.contentOpacity }}%</span>
            </div>
            <input
              v-model.number="form.contentOpacity"
              type="range"
              min="50"
              max="100"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>透明</span>
              <span>实心</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              调节文章卡片、内容区域的背景透明度
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <button
            @click="resetSettings"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            恢复默认
          </button>
          <div class="flex items-center space-x-3">
            <span v-if="saved" class="text-green-600 flex items-center">
              <Check class="w-4 h-4 mr-1" />
              已保存
            </span>
            <button
              @click="saveSettings"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              应用设置
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="lg:sticky lg:top-24">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">实时预览</h2>
          
          <!-- Mock Website Preview -->
          <div class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Mock Header -->
            <div class="h-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center px-4">
              <div class="w-6 h-6 bg-primary-600 rounded mr-2"></div>
              <div class="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            
            <!-- Mock Content with Background -->
            <div 
              class="h-64 relative"
              :style="previewContainerStyle"
            >
              <!-- Background Layer - Sharp -->
              <div 
                v-if="form.backgroundImage"
                class="absolute inset-0"
                :style="previewBgStyle"
              ></div>
              
              <!-- Blur Layer -->
              <div 
                v-if="form.blur > 0"
                class="absolute inset-0"
                :style="previewBlurStyle"
              ></div>
              
              <!-- Brightness Layer -->
              <div 
                v-if="form.brightness !== 100"
                class="absolute inset-0"
                :style="previewBrightnessStyle"
              ></div>
              
              <!-- Overlay -->
              <div 
                v-if="form.overlayOpacity > 0"
                class="absolute inset-0"
                :style="previewOverlayStyle"
              ></div>
              
              <!-- Content -->
              <div class="relative z-10 p-6">
                <div class="h-6 w-3/4 bg-gray-400/50 dark:bg-gray-600/50 rounded mb-4"></div>
                <div class="h-4 w-full bg-gray-300/50 dark:bg-gray-700/50 rounded mb-2"></div>
                <div class="h-4 w-5/6 bg-gray-300/50 dark:bg-gray-700/50 rounded mb-2"></div>
                <div class="h-4 w-4/6 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
              </div>
            </div>
            
            <!-- Mock Footer -->
            <div class="h-8 bg-white dark:bg-gray-800 flex items-center justify-center">
              <div class="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>提示：实际效果可能因内容而略有不同</p>
          </div>
        </div>

        <!-- Preset Backgrounds -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">预设背景</h2>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="(preset, index) in presets"
              :key="index"
              @click="applyPreset(preset)"
              class="aspect-video rounded-lg overflow-hidden border-2 hover:border-primary-500 transition-colors"
              :class="form.backgroundImage === preset.url ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'"
            >
              <img :src="preset.url" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-vue-next'
import { useBackgroundStore } from '../../stores/background.js'
import { configApi } from '../../services/api.js'

const backgroundStore = useBackgroundStore()
const fileInput = ref(null)
const saved = ref(false)

const form = ref({
  backgroundImage: '',
  brightness: 100,
  blur: 0,
  overlayOpacity: 0,
  contentOpacity: 95
})

// Preset backgrounds - using high quality images
const presets = [
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', brightness: 100, blur: 0, overlayOpacity: 30 },
  { url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1920&q=80', brightness: 90, blur: 2, overlayOpacity: 40 },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', brightness: 100, blur: 0, overlayOpacity: 20 },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', brightness: 110, blur: 0, overlayOpacity: 10 },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', brightness: 100, blur: 3, overlayOpacity: 35 },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', brightness: 95, blur: 1, overlayOpacity: 25 },
]

onMounted(() => {
  // Load current settings from store
  form.value.backgroundImage = backgroundStore.backgroundImage || ''
  form.value.brightness = backgroundStore.brightness ?? 100
  form.value.blur = backgroundStore.blur ?? 0
  form.value.overlayOpacity = backgroundStore.overlayOpacity ?? 0
  form.value.contentOpacity = backgroundStore.contentOpacity ?? 95
})

// Preview styles - without filter for sharp rendering
const previewStyle = computed(() => {
  if (!form.value.backgroundImage) return {}
  return {
    backgroundImage: `url(${form.value.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const previewContainerStyle = computed(() => ({
  backgroundColor: 'rgb(243, 244, 246)'
}))

const previewBgStyle = computed(() => {
  if (!form.value.backgroundImage) return {}
  return {
    backgroundImage: `url(${form.value.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const previewBrightnessStyle = computed(() => {
  const brightness = Number(form.value.brightness) || 100
  if (brightness === 100) return {}
  return {
    backgroundColor: brightness < 100 
      ? `rgba(0, 0, 0, ${(100 - brightness) / 100 * 0.5})`
      : `rgba(255, 255, 255, ${(brightness - 100) / 100 * 0.3})`
  }
})

const previewBlurStyle = computed(() => {
  const blur = Number(form.value.blur) || 0
  if (blur === 0) return {}
  return {
    backdropFilter: `blur(${blur}px)`
  }
})

const previewOverlayStyle = computed(() => {
  const opacity = Number(form.value.overlayOpacity) || 0
  return {
    backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`
  }
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // Limit file size to 1MB
  if (file.size > 1 * 1024 * 1024) {
    alert('图片大小不能超过 1MB，请选择更小的图片')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    // Directly use the image without cropping
    form.value.backgroundImage = e.target.result
  }
  reader.onerror = () => {
    alert('读取文件失败，请重试')
  }
  reader.readAsDataURL(file)
}

const removeBackground = () => {
  form.value.backgroundImage = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const applyPreset = (preset) => {
  // For presets, ask if user wants to crop
  if (confirm('预设图片已针对网页背景优化。是否直接使用？\n点击"确定"直接使用，点击"取消"进入裁剪模式')) {
    form.value.backgroundImage = preset.url
    form.value.brightness = preset.brightness ?? 100
    form.value.blur = preset.blur ?? 0
    form.value.overlayOpacity = preset.overlayOpacity ?? 0
    // Keep current contentOpacity or use default
  } else {
    // Load into cropper
    cropperImage.value = preset.url
    showCropper.value = true
  }
}

const saveSettings = async () => {
  // Create a plain object from form to ensure all values are passed correctly
  const config = {
    backgroundImage: form.value.backgroundImage,
    brightness: form.value.brightness,
    blur: form.value.blur,
    overlayOpacity: form.value.overlayOpacity,
    contentOpacity: form.value.contentOpacity
  }
  
  // Save to local store
  backgroundStore.saveBackground(config)
  
  // Also save to database
  try {
    await configApi.update('background_config', JSON.stringify(config))
  } catch (err) {
    console.error('Failed to save background to database:', err)
  }
  
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}

const resetSettings = () => {
  if (confirm('确定要恢复默认设置吗？')) {
    form.value.backgroundImage = ''
    form.value.brightness = 100
    form.value.blur = 0
    form.value.overlayOpacity = 0
    form.value.contentOpacity = 95
    backgroundStore.resetBackground()
  }
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
