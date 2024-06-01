const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to perform this action" });
    }
    next();
};

module.exports = authMiddleware;