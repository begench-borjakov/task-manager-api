import Joi from 'joi'

/**
  Validation schema for user registration
  Requires: name (min 2) , valid email , password (min 6)
 */
const registerValidationSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
    }),

    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
    }),

    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
})

/**
  Validation schema for user login
  Requires: valid email and password (min 6)
 */
const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid',
    }),

    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
})

/**
  Validation schema for updating own profile
  Allows: name , email , password
  Requires at least one field
 */
const updateOwnProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 50 characters',
    }),

    email: Joi.string().email().messages({
        'string.email': 'Email must be a valid email address',
    }),

    password: Joi.string().min(6).messages({
        'string.min': 'Password must be at least 6 characters',
    }),
})
    .or('name', 'email', 'password')
    .messages({
        'object.missing': 'At least one field must be provided',
    })

export {
    registerValidationSchema,
    loginValidationSchema,
    updateOwnProfileSchema,
}
