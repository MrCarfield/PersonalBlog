const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDatabase() {
  try {
    // 先连接 MySQL（不指定数据库）
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL');

    // 创建数据库
    const dbName = process.env.DB_NAME || 'blog_db';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database "${dbName}" created or already exists`);

    // 使用数据库
    await connection.query(`USE ${dbName}`);

    // 创建文章表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        tags JSON,
        views INT DEFAULT 0,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "posts" created');

    // 创建评论表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "comments" created');

    // 创建管理员表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "admin" created');

    // 创建站点配置表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        config_key VARCHAR(100) NOT NULL UNIQUE,
        config_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "site_config" created');

    // 插入默认管理员 (密码: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
      'INSERT IGNORE INTO admin (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );
    console.log('Default admin created (username: admin, password: admin123)');

    // 插入示例文章
    const [existingPosts] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    if (existingPosts[0].count === 0) {
      await connection.execute(`
        INSERT INTO posts (title, content, excerpt, tags) VALUES 
        (?, ?, ?, ?),
        (?, ?, ?, ?)
      `, [
        '我的第一篇博客文章',
        '<p>欢迎来到我的个人博客！这是我写的第一篇文章，我想在这里分享一些关于技术和生活的想法。</p><h2>为什么开始写博客</h2><p>写博客是一个很好的方式来记录学习过程、分享经验、建立个人品牌。</p>',
        '欢迎来到我的个人博客！这是我写的第一篇文章...',
        JSON.stringify(['随笔', '生活']),
        'Vue 3 组合式 API 入门指南',
        '<p>Vue 3 的组合式 API（Composition API）是一个强大的特性，它让我们能够更好地组织和复用逻辑。</p><h2>什么是组合式 API</h2><p>组合式 API 是一组 API，允许我们使用导入的函数而不是声明选项来编写 Vue 组件。</p>',
        'Vue 3 的组合式 API 是一个强大的特性...',
        JSON.stringify(['Vue', '前端', '教程'])
      ]);
      console.log('Sample posts inserted');
    }

    console.log('\nDatabase initialization completed successfully!');
    console.log('You can now start the server with: npm run dev');

    await connection.end();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initDatabase();
