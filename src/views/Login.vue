<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名/邮箱"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        
        <div class="form-actions">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/forgot-password" class="forgot-password">
            忘记密码？
          </router-link>
        </div>
        
        <el-button
          type="primary"
          :loading="isLoading"
          class="login-button"
          @click="handleLogin"
        >
          登录
        </el-button>
        
        <div class="register-link">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loginForm = reactive({
  username: '',
  password: ''
})

const rememberMe = ref(false)
const isLoading = ref(false)

const rules = {
  username: [
    { required: true, message: '请输入用户名/邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    const response = await axios.post('/api/auth/login', {
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: rememberMe.value
    })
    
    // 存储token
    localStorage.setItem('token', response.data.token)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f7;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  .forgot-password {
    color: #666;
    font-size: 0.875rem;
    
    &:hover {
      color: #00a1d6;
    }
  }
}

.login-button {
  width: 100%;
  margin-bottom: 1rem;
}

.register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  
  a {
    color: #00a1d6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 