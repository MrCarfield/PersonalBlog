const express = require('express');
const cors = require('cors');
const { pool, initDatabase } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ===== 文章 API =====

// 获取所有文章
app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await pool.execute(
      'SELECT * FROM posts ORDER BY date DESC'
    );
    // 解析 tags JSON
    posts.forEach(post => {
      if (post.tags) {
        try {
          post.tags = JSON.parse(post.tags);
        } catch {
          post.tags = [];
        }
      } else {
        post.tags = [];
      }
    });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  try {
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ?',
      [req.params.id]
    );
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = posts[0];
    if (post.tags) {
      try {
        post.tags = JSON.parse(post.tags);
      } catch {
        post.tags = [];
      }
    }
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// 创建文章
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    const tagsJson = JSON.stringify(tags || []);
    const [result] = await pool.execute(
      'INSERT INTO posts (title, content, excerpt, tags) VALUES (?, ?, ?, ?)',
      [title, content, excerpt, tagsJson]
    );
    res.json({ id: result.insertId, message: 'Post created' });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// 更新文章
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    const tagsJson = JSON.stringify(tags || []);
    await pool.execute(
      'UPDATE posts SET title = ?, content = ?, excerpt = ?, tags = ? WHERE id = ?',
      [title, content, excerpt, tagsJson, req.params.id]
    );
    res.json({ message: 'Post updated' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 删除文章
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// 增加浏览量
app.post('/api/posts/:id/views', async (req, res) => {
  try {
    await pool.execute(
      'UPDATE posts SET views = views + 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'View counted' });
  } catch (error) {
    console.error('Update views error:', error);
    res.status(500).json({ error: 'Failed to update views' });
  }
});

// ===== 评论 API =====

// 获取文章评论
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const [comments] = await pool.execute(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY date DESC',
      [req.params.id]
    );
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// 添加评论
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)',
      [req.params.id, author, content]
    );
    res.json({ id: result.insertId, message: 'Comment added' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// 删除评论
app.delete('/api/comments/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ===== 站点配置 API =====

// 获取配置
app.get('/api/config', async (req, res) => {
  try {
    const [configs] = await pool.execute('SELECT * FROM site_config');
    const config = {};
    configs.forEach(c => {
      config[c.config_key] = c.config_value;
    });
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Failed to get config' });
  }
});

// 更新配置
app.post('/api/config', async (req, res) => {
  try {
    const { key, value } = req.body;
    await pool.execute(
      'INSERT INTO site_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
      [key, value, value]
    );
    res.json({ message: 'Config updated' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// ===== 数据库查看 API =====

// 获取所有表的数据
app.get('/api/db/tables', async (req, res) => {
  try {
    const tables = {};
    
    // 获取文章
    const [posts] = await pool.execute('SELECT * FROM posts ORDER BY date DESC');
    posts.forEach(post => {
      if (post.tags) {
        try { post.tags = JSON.parse(post.tags); } catch { post.tags = []; }
      }
    });
    tables.posts = posts;
    
    // 获取评论
    const [comments] = await pool.execute('SELECT * FROM comments ORDER BY date DESC');
    tables.comments = comments;
    
    // 获取配置
    const [configs] = await pool.execute('SELECT * FROM site_config');
    tables.configs = configs;
    
    // 获取管理员
    const [admins] = await pool.execute('SELECT id, username, created_at FROM admin');
    tables.admins = admins;
    
    res.json(tables);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ error: 'Failed to get tables' });
  }
});

// 启动服务器
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
  });
}

startServer();
