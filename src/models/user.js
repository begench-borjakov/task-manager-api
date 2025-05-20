import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Убирает пробелы по краям
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Автоматически приводит к нижнему регистру
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

export default User
