// API 服务 - 统一处理后端请求
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// 通用请求函数
async function request(url, options = {}) {
  const fullUrl = `${API_BASE_URL}${url}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }
  
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }
  
  try {
    const response = await fetch(fullUrl, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// 文章 API
export const postsApi = {
  // 获取所有文章
  getAll: () => request('/posts'),
  
  // 获取单篇文章
  getById: (id) => request(`/posts/${id}`),
  
  // 创建文章
  create: (data) => request('/posts', { method: 'POST', body: data }),
  
  // 更新文章
  update: (id, data) => request(`/posts/${id}`, { method: 'PUT', body: data }),
  
  // 删除文章
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  
  // 增加浏览量
  addView: (id) => request(`/posts/${id}/views`, { method: 'POST' })
}

// 评论 API
export const commentsApi = {
  // 获取文章评论
  getByPostId: (postId) => request(`/posts/${postId}/comments`),
  
  // 添加评论
  create: (postId, data) => request(`/posts/${postId}/comments`, { method: 'POST', body: data }),
  
  // 删除评论
  delete: (id) => request(`/comments/${id}`, { method: 'DELETE' })
}

// 配置 API
export const configApi = {
  // 获取配置
  getAll: () => request('/config'),
  
  // 更新配置
  update: (key, value) => request('/config', { method: 'POST', body: { key, value } })
}

// 健康检查
export const healthCheck = () => request('/health')

// 数据库查看 API
export const dbApi = {
  // 获取所有表数据
  getTables: () => request('/db/tables')
}
