import Joi from 'joi'

/**
  Validation schema for creating a task
  Requires: title (string , 1–100 chars)
 */
const createTaskValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(100).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 1 character',
        'string.max': 'Title must be at most 100 characters',
        'any.required': 'Title is required',
    }),
}).unknown(false) // disallow extra fields

/**
  Validation schema for fully updating a task (PUT)
  Requires:title (string) , completed (boolean)
 */
const updateTaskValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(100).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 1 character',
        'string.max': 'Title must be at most 100 characters',
        'any.required': 'Title is required',
    }),

    completed: Joi.boolean().required().messages({
        'boolean.base': 'Completed must be true or false',
        'any.required': 'Completed is required',
    }),
}).unknown(false) // disallow extra fields

/**
  Validation schema for partially updating a task (PATCH)
  Allows:title and/or completed
  Requires at least one of them
 */
const patchTaskValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(100).messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title must not be empty',
        'string.min': 'Title must not be empty or just spaces',
        'string.max': 'Title must be less than 100 characters',
    }),

    completed: Joi.boolean().messages({
        'boolean.base': 'Completed must be true or false',
    }),
})
    .or('title', 'completed')
    .messages({
        'object.missing': 'At least one of title or completed must be provided',
    })
    .unknown(false) // disallow extra fields

export {
    createTaskValidationSchema,
    updateTaskValidationSchema,
    patchTaskValidationSchema,
}
