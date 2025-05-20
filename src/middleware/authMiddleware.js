import jwt from 'jsonwebtoken'

/*
  Middleware to authenticate user via JWT token
  Extracts user data and attaches it to req.user
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        // Check for Bearer token in Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({ message: 'Not authorized, token missing' })
        }

        // Extract token and verify
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach decoded user data to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        }

        next()
    } catch (err) {
        return res
            .status(401)
            .json({ message: 'Not authorized, invalid token' })
    }
}

export default authMiddleware
