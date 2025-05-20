import express from 'express'
import TaskController from '../controllers/taskController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import validateObjectId from '../middleware/validateObjectId.js'

const router = express.Router()

router.post('/', authMiddleware, TaskController.create)
router.get('/myTasks', authMiddleware, TaskController.getAll)
router.put('/:id', authMiddleware, validateObjectId, TaskController.update)
router.patch('/:id', authMiddleware, validateObjectId, TaskController.patch)
router.delete('/:id', authMiddleware, validateObjectId, TaskController.delete)

export default router
