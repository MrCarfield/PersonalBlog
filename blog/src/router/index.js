import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import About from '../views/About.vue'
import Tags from '../views/Tags.vue'
import { useAdminStore } from '../stores/admin.js'

// Admin routes
import AdminLogin from '../views/admin/Login.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import PostList from '../views/admin/PostList.vue'
import PostEdit from '../views/admin/PostEdit.vue'
import CommentManage from '../views/admin/CommentManage.vue'
import ProfileEdit from '../views/admin/ProfileEdit.vue'
import BackgroundSettings from '../views/admin/BackgroundSettings.vue'
import ChangePassword from '../views/admin/ChangePassword.vue'
import DatabaseView from '../views/admin/DatabaseView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: { title: '文章详情' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我' }
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags,
    meta: { title: '标签' }
  },
  {
    path: '/tag/:tag',
    name: 'TagPosts',
    component: Tags,
    meta: { title: '标签文章' }
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: '管理员登录', public: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard,
        meta: { title: '管理概览' }
      },
      {
        path: 'posts',
        name: 'PostList',
        component: PostList,
        meta: { title: '文章管理' }
      },
      {
        path: 'posts/new',
        name: 'PostNew',
        component: PostEdit,
        meta: { title: '写文章' }
      },
      {
        path: 'posts/edit/:id',
        name: 'PostEdit',
        component: PostEdit,
        meta: { title: '编辑文章' }
      },
      {
        path: 'comments',
        name: 'CommentManage',
        component: CommentManage,
        meta: { title: '评论管理' }
      },
      {
        path: 'profile',
        name: 'ProfileEdit',
        component: ProfileEdit,
        meta: { title: '编辑个人信息' }
      },
      {
        path: 'background',
        name: 'BackgroundSettings',
        component: BackgroundSettings,
        meta: { title: '背景设置' }
      },
      {
        path: 'password',
        name: 'ChangePassword',
        component: ChangePassword,
        meta: { title: '修改密码' }
      },
      {
        path: 'database',
        name: 'DatabaseView',
        component: DatabaseView,
        meta: { title: '数据库查看' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // Set page title
  const title = to.meta.title ? `${to.meta.title} - 我的个人博客` : '我的个人博客'
  document.title = title

  // Check auth for admin routes
  const adminStore = useAdminStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!adminStore.isLoggedIn) {
      next({ path: '/admin/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else if (to.path === '/admin/login' && adminStore.isLoggedIn) {
    next('/admin')
  } else {
    next()
  }
})

export default router
