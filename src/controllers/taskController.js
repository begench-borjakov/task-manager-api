import CreateTaskDto from '../dtos/createTaskDto.js'
import {
    createTaskValidationSchema,
    updateTaskValidationSchema,
    patchTaskValidationSchema,
} from '../validations/taskValidation.js'
import TaskService from '../services/taskService.js'

//  Controller for managing user tasks
//   Handles HTTP logic: request validation and response formatting

class TaskController {
    //   Create a new task for the authenticated user

    static async create(req, res, next) {
        try {
            const dto = new CreateTaskDto(req.body)

            // Validate incoming data
            const { error } = createTaskValidationSchema.validate(dto)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            const userId = req.user.id
            const task = await TaskService.createTask(dto, userId)

            return res.status(201).json({ task })
        } catch (err) {
            next(err)
        }
    }

    //   Get all tasks of the authenticated user

    static async getAll(req, res, next) {
        try {
            const userId = req.user.id
            const tasks = await TaskService.getUserTasks(userId)

            return res.status(200).json({ tasks })
        } catch (err) {
            next(err)
        }
    }

    //  Update a task fully (PUT)

    static async update(req, res, next) {
        try {
            const { error } = updateTaskValidationSchema.validate(req.body)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            const userId = req.user.id
            const taskId = req.params.id

            const updatedTask = await TaskService.updateTask(
                taskId,
                userId,
                req.body
            )

            return res.status(200).json({ task: updatedTask })
        } catch (err) {
            next(err)
        }
    }

    //   Partially update a task (PATCH)

    static async patch(req, res, next) {
        try {
            const { error } = patchTaskValidationSchema.validate(req.body)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            const taskId = req.params.id
            const userId = req.user.id
            const data = req.body

            const updatedTask = await TaskService.patchTask(
                taskId,
                userId,
                data
            )

            return res.status(200).json({ task: updatedTask })
        } catch (err) {
            next(err)
        }
    }

    //   Delete a task of the authenticated user

    static async delete(req, res, next) {
        try {
            const userId = req.user.id
            const taskId = req.params.id

            const result = await TaskService.deleteTask(taskId, userId)

            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default TaskController
