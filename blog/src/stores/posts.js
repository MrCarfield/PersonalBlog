import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsApi, commentsApi } from '../services/api.js'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const searchQuery = ref('')
  const selectedTag = ref('')

  // 从 API 加载文章
  const initPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await postsApi.getAll()
      posts.value = data
    } catch (err) {
      error.value = err.message
      console.error('Failed to load posts:', err)
    } finally {
      loading.value = false
    }
  }

  const allTags = computed(() => {
    const tags = new Set()
    posts.value.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  })

  const filteredPosts = computed(() => {
    let result = posts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    if (selectedTag.value) {
      result = result.filter(post => post.tags && post.tags.includes(selectedTag.value))
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  const getPostById = (id) => {
    return posts.value.find(post => post.id === Number(id))
  }

  const getPostsByTag = (tag) => {
    return posts.value.filter(post => post.tags && post.tags.includes(tag))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // 增加浏览量
  const incrementViews = async (id) => {
    try {
      await postsApi.addView(id)
      const post = posts.value.find(p => p.id === Number(id))
      if (post) {
        post.views = (post.views || 0) + 1
      }
    } catch (err) {
      console.error('Failed to increment views:', err)
    }
  }
  
  // 添加站点访问
  const addSiteVisit = () => {
    const sessionVisited = sessionStorage.getItem('site-visited')
    if (sessionVisited) return
    
    sessionStorage.setItem('site-visited', 'true')
    
    posts.value.forEach(post => {
      post.views = (post.views || 0) + 1
    })
  }
  
  // 获取评论数
  const getActualCommentCount = async (postId) => {
    try {
      const comments = await commentsApi.getByPostId(postId)
      return comments.length
    } catch (err) {
      console.error('Failed to get comment count:', err)
      return 0
    }
  }
  
  // 获取文章评论
  const getComments = async (postId) => {
    try {
      return await commentsApi.getByPostId(postId)
    } catch (err) {
      console.error('Failed to get comments:', err)
      return []
    }
  }
  
  // 添加评论
  const addComment = async (postId, comment) => {
    try {
      await commentsApi.create(postId, comment)
      return await getComments(postId)
    } catch (err) {
      console.error('Failed to add comment:', err)
      throw err
    }
  }
  
  // 删除评论
  const deleteComment = async (postId, commentId) => {
    try {
      await commentsApi.delete(commentId)
      return await getComments(postId)
    } catch (err) {
      console.error('Failed to delete comment:', err)
      throw err
    }
  }
  
  // 获取所有评论
  const getAllComments = async () => {
    const allComments = []
    for (const post of posts.value) {
      try {
        const comments = await getComments(post.id)
        comments.forEach(comment => {
          allComments.push({
            ...comment,
            postId: post.id,
            postTitle: post.title
          })
        })
      } catch (err) {
        console.error(`Failed to get comments for post ${post.id}:`, err)
      }
    }
    return allComments.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setSelectedTag = (tag) => {
    selectedTag.value = tag
  }

  const getAdjacentPosts = (id) => {
    const sortedPosts = [...posts.value].sort((a, b) => new Date(b.date) - new Date(a.date))
    const index = sortedPosts.findIndex(post => post.id === Number(id))
    
    return {
      prev: index < sortedPosts.length - 1 ? sortedPosts[index + 1] : null,
      next: index > 0 ? sortedPosts[index - 1] : null
    }
  }

  // 管理员功能
  const createPost = async (postData) => {
    try {
      const result = await postsApi.create(postData)
      await initPosts()
      return result
    } catch (err) {
      console.error('Failed to create post:', err)
      throw err
    }
  }

  const updatePost = async (id, postData) => {
    try {
      await postsApi.update(id, postData)
      await initPosts()
    } catch (err) {
      console.error('Failed to update post:', err)
      throw err
    }
  }

  const deletePost = async (id) => {
    try {
      await postsApi.delete(id)
      await initPosts()
    } catch (err) {
      console.error('Failed to delete post:', err)
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    searchQuery,
    selectedTag,
    allTags,
    filteredPosts,
    getPostById,
    getPostsByTag,
    incrementViews,
    addSiteVisit,
    setSearchQuery,
    setSelectedTag,
    getAdjacentPosts,
    initPosts,
    getActualCommentCount,
    getComments,
    addComment,
    deleteComment,
    getAllComments,
    createPost,
    updatePost,
    deletePost
  }
})
