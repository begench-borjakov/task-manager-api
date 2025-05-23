//  Middleware to restrict access to admin-only routes
const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: admin only' })
    }

    next()
}

export default adminMiddleware
