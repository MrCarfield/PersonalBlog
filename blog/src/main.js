import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import { useAdminStore } from './stores/admin.js'
import { usePostsStore } from './stores/posts.js'
import { useConfigStore } from './stores/config.js'
import { useBackgroundStore } from './stores/background.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize stores
const adminStore = useAdminStore()
const postsStore = usePostsStore()
const configStore = useConfigStore()
const backgroundStore = useBackgroundStore()

adminStore.initAuth()
postsStore.initPosts()
configStore.initConfig()
backgroundStore.initBackground()

app.mount('#app')
