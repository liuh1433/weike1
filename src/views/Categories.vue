<template>
  <div class="categories-container">
    <div class="category-filters">
      <div class="filter-group">
        <h3>学科分类</h3>
        <el-radio-group v-model="selectedSubject">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="chinese">语文</el-radio-button>
          <el-radio-button label="math">数学</el-radio-button>
          <el-radio-button label="english">英语</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-group">
        <h3>年级分类</h3>
        <el-radio-group v-model="selectedGrade">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="primary-low">小学低年级</el-radio-button>
          <el-radio-button label="primary-high">小学高年级</el-radio-button>
          <el-radio-button label="junior">初中</el-radio-button>
          <el-radio-button label="senior">高中</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <div class="video-grid">
      <div v-for="video in filteredVideos" :key="video.id" class="video-card">
        <router-link :to="{ name: 'VideoPlayer', params: { id: video.id }}">
          <div class="video-thumbnail">
            <img :src="video.thumbnail" :alt="video.title">
            <span class="duration">{{ video.duration }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-meta">
              <span>{{ video.subject }}</span>
              <span>{{ video.grade }}</span>
              <span>{{ video.views }}次观看</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const videos = ref([])
const selectedSubject = ref('all')
const selectedGrade = ref('all')

const fetchVideos = async () => {
  try {
    const response = await axios.get('/api/videos', {
      params: {
        subject: selectedSubject.value !== 'all' ? selectedSubject.value : undefined,
        grade: selectedGrade.value !== 'all' ? selectedGrade.value : undefined
      }
    })
    videos.value = response.data
  } catch (error) {
    console.error('获取视频列表失败:', error)
  }
}

const filteredVideos = computed(() => {
  return videos.value.filter(video => {
    const subjectMatch = selectedSubject.value === 'all' || video.subject === selectedSubject.value
    const gradeMatch = selectedGrade.value === 'all' || video.grade === selectedGrade.value
    return subjectMatch && gradeMatch
  })
})

onMounted(() => {
  fetchVideos()
})

// 监听筛选条件变化
watch([selectedSubject, selectedGrade], () => {
  fetchVideos()
})
</script>

<style lang="scss" scoped>
.categories-container {
  padding: 2rem;
}

.category-filters {
  margin-bottom: 2rem;
  
  .filter-group {
    margin-bottom: 1.5rem;
    
    h3 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      color: #333;
    }
    
    .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.video-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
  }
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 12px;
  }
}

.video-info {
  padding: 1rem;
  
  .video-title {
    font-size: 1rem;
    margin: 0 0 0.5rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .video-meta {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.875rem;
  }
}
</style> 