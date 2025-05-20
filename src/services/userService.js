import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'

//   Service layer for user-related business logic: registration, login, profile updates

class UserService {
    //   Register a new user
    static async registerUser(dto) {
        const existingUser = await User.findOne({ email: dto.email })
        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const newUser = new User({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()
        const token = generateToken(savedUser)

        return {
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
            },
        }
    }

    //   Log in a user by checking credentials and returning a token

    static async loginUser(dto) {
        const user = await User.findOne({ email: dto.email })

        if (!user) {
            const error = new Error('Invalid email or password')
            error.status = 401
            throw error
        }

        const isPasswordMatch = await bcrypt.compare(
            dto.password,
            user.password
        )
        if (!isPasswordMatch) {
            const error = new Error('Invalid email or password')
            error.status = 401
            throw error
        }

        const token = generateToken(user)

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        }
    }

    //   Get a user by their ID (used by admin routes)

    static async getUserById(id) {
        const user = await User.findById(id)

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            throw error
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }
    }

    //   Update profile of the authenticated user

    static async updateOwnUser(userId, dto) {
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            throw error
        }

        if (dto.email && dto.email !== user.email) {
            const existing = await User.findOne({ email: dto.email })
            if (existing) {
                const error = new Error('Email already in use')
                error.status = 400
                throw error
            }
            user.email = dto.email
        }

        if (dto.name) user.name = dto.name
        if (dto.password) {
            user.password = await bcrypt.hash(dto.password, 10)
        }

        const updated = await user.save()

        const token = generateToken({
            id: updated._id,
            email: updated.email,
            isAdmin: updated.isAdmin,
        })

        return {
            token,
            user: {
                id: updated._id,
                name: updated.name,
                email: updated.email,
                isAdmin: updated.isAdmin,
            },
        }
    }

    //   Delete the authenticated user's account

    static async deleteOwnUser(userId) {
        const user = await User.findByIdAndDelete(userId)

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            throw error
        }

        return {
            message: 'Account successfully deleted',
            id: userId,
        }
    }
}

export default UserService
