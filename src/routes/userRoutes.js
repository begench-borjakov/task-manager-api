import express from 'express'
import UserController from '../controllers/userController.js'
import authMiddlewear from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import validateObjectId from '../middleware/validateObjectId.js'

const router = express.Router()

router.get('/me', authMiddlewear, UserController.getMe)
router.get(
    '/:id',
    authMiddlewear,
    adminMiddleware,
    validateObjectId,
    UserController.getById
)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/me', authMiddlewear, UserController.updateMe)
router.delete('/me', authMiddlewear, UserController.deleteMe)

export default router
