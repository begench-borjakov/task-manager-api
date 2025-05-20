import mongoose from 'mongoose'

//   Middleware to validate MongoDB ObjectId in route parameters

const validateObjectId = (req, res, next) => {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
    }

    next()
}

export default validateObjectId
