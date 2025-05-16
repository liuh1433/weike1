# 微课学习平台

一个基于Vue 3的在线教育视频平台，集成了B站视频播放器和AI助手功能。

## 功能特点

### 1. 视频播放
- 集成B站播放器
- 支持视频信息展示
- 显示播放量、点赞数等数据
- 支持视频分享功能

### 2. AI助手
- 实时对话功能
- 专业的教育辅导
- 支持快捷键操作


### 3. 课程分类
- 学科分类
- 年级分类
- 热门课程推荐
- 个性化推荐

## 技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- UI组件库：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP客户端：Axios
- 视频播放：Video.js
- CSS预处理：Sass
- AI接口：Deepseek API

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装

```bash
# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
src/
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # Pinia状态管理
├── views/         # 页面组件
│   ├── Home.vue           # 首页
│   ├── VideoPlayer.vue    # 视频播放页
│   ├── Categories.vue     # 分类页
│   ├── Popular.vue        # 热门页
│   ├── Login.vue          # 登录页
│   └── Register.vue       # 注册页
└── App.vue       # 根组件
```

## 主要功能说明

### 视频播放页 (VideoPlayer.vue)
- B站视频嵌入播放
- 视频信息展示
- AI助手实时对话
- 弹幕互动功能

### 首页 (Home.vue)
- 视频列表展示
- 分类导航
- 搜索功能
- 用户登录/注册入口


## API集成

### AI助手API
- 使用Deepseek API
- 支持流式响应
- 专业教育问答
- 实时交互

### 视频API
- B站视频嵌入
- 视频信息获取
- 播放数据统计
- 用户互动数据
