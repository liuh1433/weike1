const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const videoRoutes = require('./routes/videos')
const userRoutes = require('./routes/users')
const aiRoutes = require('./routes/ai')

dotenv.config()

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 连接MongoDB数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

// 路由
app.use('/api/videos', videoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/ai', aiRoutes)

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: '服务器内部错误' })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 