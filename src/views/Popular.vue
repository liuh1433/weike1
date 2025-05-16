<template>
  <div class="popular-container">
    <div class="section-header">
      <h2>热门微课</h2>
      <el-select v-model="timeRange" placeholder="选择时间范围">
        <el-option label="今日" value="today" />
        <el-option label="本周" value="week" />
        <el-option label="本月" value="month" />
        <el-option label="全部" value="all" />
      </el-select>
    </div>
    
    <div class="video-list">
      <div v-for="(video, index) in popularVideos" :key="video.id" class="video-item">
        <div class="rank-number">{{ index + 1 }}</div>
        <router-link :to="{ name: 'VideoPlayer', params: { id: video.id }}" class="video-content">
          <div class="video-thumbnail">
            <img :src="video.thumbnail" :alt="video.title">
            <span class="duration">{{ video.duration }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-stats">
              <span>{{ video.views }}次观看</span>
              <span>{{ video.likes }}点赞</span>
            </div>
            <div class="video-meta">
              <span>{{ video.subject }}</span>
              <span>{{ video.grade }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const timeRange = ref('week')
const popularVideos = ref([])

const fetchPopularVideos = async () => {
  try {
    const response = await axios.get('/api/videos/popular', {
      params: { timeRange: timeRange.value }
    })
    popularVideos.value = response.data
  } catch (error) {
    console.error('获取热门视频失败:', error)
  }
}

onMounted(() => {
  fetchPopularVideos()
})

watch(timeRange, () => {
  fetchPopularVideos()
})
</script>

<style lang="scss" scoped>
.popular-container {
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    color: #333;
  }
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(4px);
  }
}

.rank-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  background: #00a1d6;
  
  &:nth-child(-n+3) {
    background: #ff6b6b;
  }
}

.video-content {
  display: flex;
  flex: 1;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.video-thumbnail {
  position: relative;
  width: 180px;
  height: 100px;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 12px;
  }
}

.video-info {
  flex: 1;
  
  .video-title {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }
  
  .video-stats {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .video-meta {
    display: flex;
    gap: 1rem;
    color: #999;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .video-content {
    flex-direction: column;
  }
  
  .video-thumbnail {
    width: 100%;
    height: 0;
    padding-top: 56.25%;
    margin-right: 0;
    margin-bottom: 1rem;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style> 