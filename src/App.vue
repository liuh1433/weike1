<template>
  <div class="app-container">
    <header class="header">
      <nav class="nav-container">
        <div class="logo">微课学习平台</div>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/categories">分类</router-link>
          <router-link to="/popular">热门</router-link>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索课程..."
            prefix-icon="el-icon-search"
          />
        </div>
        <div class="user-actions">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="handleRegister">注册</el-button>
        </div>
      </nav>
    </header>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <footer class="footer">
      <p>&copy; 2025 微课学习平台. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const handleLogin = () => {
  // TODO: 实现登录逻辑
}

const handleRegister = () => {
  // TODO: 实现注册逻辑
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00a1d6;
}

.nav-links {
  display: flex;
  gap: 2rem;
  
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    
    &:hover {
      color: #00a1d6;
    }
  }
}

.search-box {
  width: 300px;
}

.main-content {
  margin-top: 60px;
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 60px auto 0;
}

.footer {
  background-color: #f4f4f4;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}
</style> 