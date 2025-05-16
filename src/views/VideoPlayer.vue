<template>
  <div class="video-player-container">
    <div class="main-content">
      <div class="video-wrapper">
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered"
          controls
          preload="auto"
          width="100%"
          height="100%"
          poster="/src/videos/er.png"
        >
          <source :src="videoUrl" type="video/mp4" />
          您的浏览器不支持 HTML5 视频播放。
        </video>
      </div>
      
      <div class="video-info">
        <div class="video-header">
          <h1 class="video-title">{{ videoTitle }}</h1>
          <div class="video-actions">
            <el-button type="primary" plain>
              <i class="el-icon-video-play"></i>
              {{ formatNumber(viewCount) }}播放
            </el-button>
            <el-button type="primary" plain>
              <i class="el-icon-star-on"></i>
              {{ formatNumber(likeCount) }}点赞
            </el-button>
            <el-button type="primary" plain>
              <i class="el-icon-share"></i>
              分享
            </el-button>
          </div>
        </div>
        
        <div class="video-meta">
          <div class="uploader-info">
            <img :src="uploaderAvatar" :alt="uploaderName" class="uploader-avatar" width="20px">
            <div class="uploader-details">
              <span class="uploader-name">{{ uploaderName }}</span>
              <span class="uploader-fans">{{ formatNumber(uploaderFans) }}粉丝</span>
            </div>
            <el-button type="primary" class="follow-btn">关注</el-button>
          </div>
          <div class="video-stats">
            <span class="upload-time">发布于 {{ formatTime(uploadTime) }}</span>
            <span class="video-duration">时长 {{ videoDuration }}</span>
          </div>
        </div>
        
        <div class="video-description">
          <div class="description-content">{{ videoDescription }}</div>
          <div class="description-tags">
            <el-tag
              v-for="tag in videoTags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="video-comments">
        <h3 class="comments-title">评论 {{ commentCount }}</h3>
        <div class="comment-input">
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="3"
            placeholder="发一条友善的评论"
          />
          <el-button type="primary" @click="submitComment">发布评论</el-button>
        </div>
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <img :src="comment.userAvatar" :alt="comment.userName" class="comment-avatar">
            <div class="comment-content">
              <div class="comment-user">{{ comment.userName }}</div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-meta">
                <span class="comment-time">{{ formatTime(comment.time) }}</span>
                <div class="comment-actions">
                  <span class="action-item">
                    <i class="el-icon-thumb"></i>
                    {{ formatNumber(comment.likes) }}
                  </span>
                  <span class="action-item">回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="video-list">
        <div v-for="i in 6" :key="i" class="video-item" @click="playVideo('/src/videos/lecture.mp4', '黄鹤楼')">
          <div class="video-thumbnail">
            <span class="duration">12:30</span>
            <div class="video-info-overlay">
              <span class="play-count">
                <i class="el-icon-video-play"></i>
                1.5万
              </span>
            </div>
          </div>
          <div class="video-info">
            <h4 class="video-title">黄鹤楼</h4>
            <div class="video-meta">
              <div class="uploader">
                <img :src="uploaderAvatar" :alt="uploaderName">
                <span>语文老师张书</span>
              </div>
              <span>1.5万播放 · 2024/2/20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="video-sidebar">
      <div class="recommended-videos">
        <h3 class="sidebar-title">相关推荐</h3>
        <div class="video-list">
          <div v-for="video in recommendedVideos" :key="video.id" class="video-item">
            <router-link :to="{ name: 'VideoPlayer', params: { id: video.id }}">
              <div class="video-thumbnail">
                <img :src="video.thumbnail" :alt="video.title">
                <span class="duration">{{ video.duration }}</span>
                <div class="video-info-overlay">
                  <span class="play-count">
                    <i class="el-icon-video-play"></i>
                    {{ formatNumber(video.views) }}
                  </span>
                </div>
              </div>
              <div class="video-info">
                <h4 class="video-title">{{ video.title }}</h4>
                <div class="video-meta">
                  <span class="uploader">{{ video.uploader }}</span>
                  <span class="upload-time">{{ formatTime(video.uploadTime) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="ai-chat">
        <h3 class="sidebar-title">AI助手</h3>
        <div class="chat-messages" ref="chatMessages">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="3"
            placeholder="请输入您的问题..."
            @keyup.enter.native="sendMessage"
          />
          <el-button type="primary" @click="sendMessage" :loading="isLoading">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const videoPlayer = ref(null)
const player = ref(null)

// 视频相关数据
const videoUrl = ref('/src/videos/lecture.mp4')
const videoTitle = ref('黄鹤楼')
const viewCount = ref(0)
const likeCount = ref(0)
const videoDescription = ref('古诗黄鹤楼')
const videoDuration = ref('12:34')
const videoTags = ref(['教育', '微课', '在线学习'])
const uploadTime = ref(new Date())
const uploaderName = ref('语文老师')
const uploaderAvatar = ref('/src/videos/用户.png')
const uploaderFans = ref(10000)

// 评论相关数据
const comments = ref([])
const commentCount = ref(0)
const commentContent = ref('')

// 推荐视频数据
const recommendedVideos = ref([])

// AI聊天相关数据
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const chatMessages = ref(null)
const currentAssistantMessage = ref('')

let correctAnswer = '';
let currentAnalysis = '';
let questions = [];
let currentIndex = 0;
let score = 0;

// 抖音视频链接
const douyinUrl = 'https://v.douyin.com/znY_Q_5AM_k/';

// 格式化数字（万为单位）
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) { // 1天内
    return Math.floor(diff / 3600000) + '小时前'
  } else if (diff < 604800000) { // 1周内
    return Math.floor(diff / 86400000) + '天前'
  } else {
    return date.toLocaleDateString()
  }
}

// 获取抖音视频真实地址
async function getDouyinVideoUrl() {
  try {
    // 获取重定向后的URL
    const response = await axios.get(douyinUrl, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });
    
    // 从响应头中获取真实视频地址
    const realUrl = response.headers.location;
    if (realUrl) {
      // 更新播放器源
      if (player.value) {
        player.value.src({
          src: realUrl,
          type: 'video/mp4'
        });
      }
    }
  } catch (error) {
    console.error('获取抖音视频地址失败:', error);
  }
}

// 初始化视频播放器
onMounted(() => {
  player.value = videojs(videoPlayer.value, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'progressControl',
        'playbackRateMenuButton',
        'fullscreenToggle'
      ]
    }
  })
  
  // 监听播放器事件
  player.value.on('loadedmetadata', () => {
    // 更新视频时长
    const duration = player.value.duration()
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    videoDuration.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  player.value.on('error', (error) => {
    console.error('视频加载失败:', error)
  })

  // 添加视频播放完成事件监听
  player.value.on('ended', () => {
    // 显示提示对话框
    ElMessageBox.confirm(
      '视频播放完成,是否开始答题?',
      '提示',
      {
        confirmButtonText: '开始答题',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      // 跳转到答题页面
      window.open('/src/选择题大闯关/index.html', '_blank')
    }).catch(() => {
      // 用户取消跳转
      console.log('用户取消跳转')
    })
  })
  
  // 从API获取视频信息
  fetchVideoInfo()
  fetchComments()
  fetchRecommendedVideos()

  // 获取抖音视频地址
  getDouyinVideoUrl()
})

// 清理视频播放器
onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})

// 获取视频信息
const fetchVideoInfo = async () => {
  try {
    const response = await axios.get(`/api/videos/${route.params.id}`)
    const { 
      url, 
      title, 
      views, 
      likes, 
      description,
      duration,
      tags,
      uploadTime,
      uploader
    } = response.data
    
    videoUrl.value = url
    videoTitle.value = title
    viewCount.value = views
    likeCount.value = likes
    videoDescription.value = description
    videoDuration.value = duration
    videoTags.value = tags
    uploadTime.value = new Date(uploadTime)
    uploaderName.value = uploader.name
    uploaderAvatar.value = uploader.avatar
    uploaderFans.value = uploader.fans
  } catch (error) {
    console.error('获取视频信息失败:', error)
  }
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const response = await axios.get(`/api/videos/${route.params.id}/comments`)
    comments.value = response.data.comments
    commentCount.value = response.data.total
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 获取推荐视频
const fetchRecommendedVideos = async () => {
  try {
    const response = await axios.get(`/api/videos/${route.params.id}/recommended`)
    recommendedVideos.value = response.data
  } catch (error) {
    console.error('获取推荐视频失败:', error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return
  
  try {
    await axios.post(`/api/videos/${route.params.id}/comments`, {
      content: commentContent.value
    })
    
    commentContent.value = ''
    fetchComments() // 重新获取评论列表
  } catch (error) {
    console.error('提交评论失败:', error)
  }
}

// 发送消息到Deepseek API
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const userMessage = userInput.value.trim()
  messages.value.push({ role: 'user', content: userMessage })
  userInput.value = ''
  isLoading.value = true
  
  // 创建一个空的助手消息
  currentAssistantMessage.value = ''
  messages.value.push({ role: 'assistant', content: '' })
  const currentMessageIndex = messages.value.length - 1
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk-03a2232c3ce3468ca8e9505c68330437`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个专业的教育辅导助手,可以帮助学生解答问题。" },
          ...messages.value.slice(0, -1) // 不包含最后一条空消息
        ],
        stream: true
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const json = JSON.parse(data)
            const content = json.choices[0].delta.content || ''
            currentAssistantMessage.value += content
            messages.value[currentMessageIndex].content = currentAssistantMessage.value
            
            // 滚动到最新消息
            await nextTick()
            if (chatMessages.value) {
              chatMessages.value.scrollTop = chatMessages.value.scrollHeight
            }
          } catch (e) {
            console.error('解析响应数据失败:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('AI回复失败:', error)
    messages.value[currentMessageIndex].content = '抱歉,我现在无法回答。请稍后再试。'
  } finally {
    isLoading.value = false
    currentAssistantMessage.value = ''
  }
}

// 播放视频
const playVideo = (url, title) => {
  videoUrl.value = url
  videoTitle.value = title
  
  // 更新播放器源
  if (player.value) {
    player.value.src({
      src: url,
      type: 'video/mp4'
    })
    player.value.load()
    player.value.play()
  }
}
</script>

<style lang="scss" scoped>
.video-player-container {
  display: flex;
  padding: 0;
  background: #f1f2f3;
  min-height: 100vh;
  margin: 60px auto 0;
  gap: 20px;
  max-width: 2100px;
}

.main-content {
  flex: 1;
  max-width: 1300px;
  min-width: 1300px;
  display: flex;
  flex-direction: column;
}

.video-wrapper {
  background: #000;
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  max-height: none;
  height: auto;
}

.video-info {
  background: #fff;
  border-radius: 0;
  padding: 20px;
  margin: 0;
  box-shadow: none;
  width: 100%;
  
  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .video-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      flex: 1;
      margin-right: 20px;
      line-height: 1.5;
    }
    
    .video-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
      
      .el-button {
        height: 36px;
      }
    }
  }
}

.video-comments {
  background: #fff;
  margin-top: 12px;
  padding: 20px;
  width: 100%;
  
  .comments-title {
    font-size: 16px;
    color: #18191c;
  }
  
  .comment-input {
    margin: 16px 0;
    
    .el-input {
      margin-bottom: 12px;
    }
  }
}

.video-sidebar {
  width: 800px;
  min-width: 800px;
  background: #fff;
  border-left: 1px solid #e3e5e7;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  position: sticky;
  top: 60px;
  
  .recommended-videos {
    background: transparent;
    box-shadow: none;
    padding: 0;
    
    .sidebar-title {
      padding: 20px 20px 12px;
      margin: 0;
      font-size: 16px;
      color: #18191c;
    }
    
    .video-list {
      padding: 0 20px;
    }
    
    .video-item {
      margin-bottom: 12px;
      
      .video-thumbnail {
        border-radius: 6px;
      }
      
      .video-info {
        padding: 8px 0;
        box-shadow: none;
        
        .video-title {
          font-size: 14px;
          margin-bottom: 4px;
          height: 40px;
        }
      }
    }
  }
  
  .ai-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .sidebar-title {
      padding: 16px 20px;
      margin: 0;
      font-size: 18px;
      color: #18191c;
      border-bottom: 1px solid #e3e5e7;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      .message {
        margin-bottom: 16px;
        
        .message-content {
          padding: 8px 12px;
          border-radius: 4px;
          max-width: 85%;
          word-break: break-word;
          white-space: pre-wrap;
        }
      }
      
      .user-message {
        display: flex;
        justify-content: flex-end;
        
        .message-content {
          background: #e3f2fd;
          margin-left: auto;
        }
      }
      
      .ai-message {
        .message-content {
          background: #f5f5f5;
        }
      }
    }
    
    .chat-input {
      padding: 16px;
      border-top: 1px solid #e3e5e7;
      background: #fff;
      
      .el-input {
        margin-bottom: 12px;
      }
      
      .el-button {
        width: 100%;
      }
    }
  }
}

@media (max-width: 2150px) {
  .video-player-container {
    margin: 60px 20px 0;
  }
}

@media (max-width: 1600px) {
  .video-player-container {
    flex-direction: column;
    margin: 60px auto 0;
    max-width: 1300px;
  }
  
  .main-content {
    min-width: 0;
    width: 100%;
  }
  
  .video-sidebar {
    width: 100%;
    min-width: 0;
    height: 500px;
    position: relative;
    top: 0;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .video-player-container {
    margin: 60px 0 0;
  }
  
  .video-info {
    padding: 12px;
  }
  
  .video-comments {
    padding: 12px;
  }
}

.video-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  
  .video-item {
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    transition: transform 0.2s;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .video-thumbnail {
      position: relative;
      width: 100%;
      padding-top: 56.25%; // 16:9 比例
      background: #f5f5f5;
      background-image: url('/src/videos/er.png');
      background-size: cover;
      background-position: center;
      
      .duration {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .video-info-overlay {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        
        .play-count {
          display: flex;
          align-items: center;
          gap: 4px;
          
          i {
            font-size: 14px;
          }
        }
      }
    }
    
    .video-info {
      padding: 12px;
      
      .video-title {
        font-size: 16px;
        font-weight: 500;
        margin: 0 0 8px;
        line-height: 1.4;
        color: #18191c;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .video-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #666;
        font-size: 14px;
        
        .uploader {
          display: flex;
          align-items: center;
          gap: 6px;
          
          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .video-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .video-list {
    grid-template-columns: 1fr;
    padding: 12px;
  }
}
</style> 