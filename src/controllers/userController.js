import User from '../models/user.js'
import CreateUserDto from '../dtos/createUserDto.js'
import LoginUserDto from '../dtos/loginUserdto.js'
import {
    registerValidationSchema,
    loginValidationSchema,
    updateOwnProfileSchema,
} from '../validations/userValidation.js'
import generateToken from '../utils/generateToken.js'
import UserService from '../services/userService.js'

//   Controller for user authentication and profile management
//   Handles HTTP-level request validation and response formatting

class UserController {
    //   Register a new user
    static async register(req, res, next) {
        try {
            const dto = new CreateUserDto(req.body)

            // Validate registration data
            const { error } = registerValidationSchema.validate(dto)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            // Create user via service
            const userData = await UserService.registerUser(dto)

            return res.status(201).json({ user: userData })
        } catch (err) {
            next(err)
        }
    }

    //   Log in an existing user and return JWT

    static async login(req, res, next) {
        try {
            const dto = new LoginUserDto(req.body)

            // Validate login data
            const { error } = loginValidationSchema.validate(dto)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            const userData = await UserService.loginUser(dto)

            return res.status(200).json(userData)
        } catch (err) {
            next(err)
        }
    }

    //   Get profile of the currently authenticated user

    static async getMe(req, res, next) {
        try {
            const user = await User.findById(req.user.id).select('-password')
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            return res.status(200).json({
                message: 'Authorized user info',
                user,
            })
        } catch (err) {
            next(err)
        }
    }

    //   Get user by ID (only for admin)

    static async getById(req, res, next) {
        try {
            const user = await UserService.getUserById(req.params.id)
            return res.status(200).json({ user })
        } catch (err) {
            next(err)
        }
    }

    //   Update profile of the currently authenticated user

    static async updateMe(req, res, next) {
        try {
            const { error } = updateOwnProfileSchema.validate(req.body)
            if (error) {
                return res
                    .status(400)
                    .json({ message: error.details[0].message })
            }

            const userId = req.user.id
            const result = await UserService.updateOwnUser(userId, req.body)

            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    //   Delete the currently authenticated user

    static async deleteMe(req, res, next) {
        try {
            const result = await UserService.deleteOwnUser(req.user.id)
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }
}

export default UserController
