<template>
  <div class="home-container">
    <div class="video-grid">
      <div v-for="video in videos" :key="video.id" class="video-card">
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
            <div class="video-title">{{ video.title }}</div>
            <div class="video-meta">
              <div class="uploader-info">
                <img :src="video.uploaderAvatar" :alt="video.uploader" class="uploader-avatar">
                <span class="uploader-name">{{ video.uploader }}</span>
              </div>
              <div class="video-stats">
                <span>{{ formatNumber(video.views) }}播放</span>
                <span>{{ formatTime(video.uploadTime) }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const videos = ref([
  {
    id: 1,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  },
  {
    id: 2,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  },
  {
    id: 3,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  },
  {
    id: 4,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  },
  {
    id: 5,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  },
  {
    id: 6,
    title: '黄鹤楼',
    thumbnail: 'src\\videos\\er.png',
    duration: '12:30',
    views: 15000,
    uploader: '语文老师张书',
    uploaderAvatar: 'src\\videos\\er.png',
    uploadTime: new Date('2024-02-20')
  }
])

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

// 注释掉原来的fetchVideos函数调用
// onMounted(() => {
//   fetchVideos()
// })
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
  max-width: 2000px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.video-card {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  width: 400px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    .video-thumbnail img {
      transform: scale(1.05);
    }
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 62.5%; // 8:5 比例
  background: #000;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .video-info-overlay {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 8px;
    
    .play-count {
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
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
    font-size: 15px;
    line-height: 1.4;
    margin-bottom: 8px;
    color: #18191c;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 42px;
  }
  
  .video-meta {
    .uploader-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      
      .uploader-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .uploader-name {
        font-size: 13px;
        color: #757575;
      }
    }
    
    .video-stats {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #9499a0;
    }
  }
}

@media (max-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  
  .video-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
  
  .video-info {
    padding: 8px;
    
    .video-title {
      font-size: 14px;
      height: 38px;
    }
    
    .video-meta {
      .uploader-info {
        .uploader-avatar {
          width: 20px;
          height: 20px;
        }
        
        .uploader-name {
          font-size: 12px;
        }
      }
      
      .video-stats {
        font-size: 12px;
      }
    }
  }
}
</style> 