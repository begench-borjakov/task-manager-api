import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import errorHandler from './middleware/errorHandler.js'

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
