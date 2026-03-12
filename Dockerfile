FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY server/package*.json ./
RUN npm install

# 复制代码
COPY server/ ./

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "index.js"]
