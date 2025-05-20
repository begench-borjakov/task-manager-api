import Task from '../models/Task.js'
import dayjs from 'dayjs'

//   Service layer for task-related business logic

class TaskService {
    //   Create a new task with daily and total task limits
    static async createTask(dto, userId) {
        // Enforce total task limit per user
        const totalTasks = await Task.countDocuments({ user: userId })
        if (totalTasks >= 500) {
            const error = new Error('Task limit reached (500 total)')
            error.status = 403
            throw error
        }

        // Enforce daily task creation limit
        const today = dayjs().startOf('day').toDate()
        const tasksToday = await Task.countDocuments({
            user: userId,
            createdAt: { $gte: today },
        })
        if (tasksToday >= 10) {
            const error = new Error('Daily task limit reached (10 per day)')
            error.status = 429
            throw error
        }

        // Create and save the task
        const newTask = new Task({
            title: dto.title,
            user: userId,
        })

        const savedTask = await newTask.save()

        return {
            id: savedTask._id,
            title: savedTask.title,
            completed: savedTask.completed,
            createdAt: savedTask.createdAt,
        }
    }

    //   Get all tasks of the user, sorted by creation date

    static async getUserTasks(userId) {
        const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })

        return tasks.map((task) => ({
            id: task._id,
            title: task.title,
            completed: task.completed,
            createdAt: task.createdAt,
        }))
    }

    //   Fully update a task (PUT)

    static async updateTask(taskId, userId, data) {
        const task = await Task.findOne({ _id: taskId, user: userId })
        if (!task) {
            const error = new Error('Task not found or access denied')
            error.status = 404
            throw error
        }

        task.title = data.title
        task.completed = data.completed

        const updated = await task.save()

        return {
            id: updated._id,
            title: updated.title,
            completed: updated.completed,
            updatedAt: updated.updatedAt,
        }
    }

    //   Partially update a task (PATCH)

    static async patchTask(taskId, userId, data) {
        const task = await Task.findOne({ _id: taskId, user: userId })
        if (!task) {
            const error = new Error('Task not found or access denied')
            error.status = 404
            throw error
        }

        // Apply only provided fields
        if (data.title !== undefined) {
            task.title = data.title
        }
        if (data.completed !== undefined) {
            task.completed = data.completed
        }

        const updatedTask = await task.save()

        return {
            id: updatedTask._id,
            title: updatedTask.title,
            completed: updatedTask.completed,
            updatedAt: updatedTask.updatedAt,
        }
    }

    //   Delete a task if it belongs to the user

    static async deleteTask(taskId, userId) {
        const task = await Task.findOneAndDelete({ _id: taskId, user: userId })

        if (!task) {
            const error = new Error('Task not found or access denied')
            error.status = 404
            throw error
        }

        return {
            message: 'Task successfully deleted',
            id: taskId,
        }
    }
}

export default TaskService
