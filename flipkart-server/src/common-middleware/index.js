const jwt = require('jsonwebtoken');

exports.requireSignIn = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        const token = authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;
    } else {
        return res.status(400).json({ message: 'Authorization Required.'});
    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({
            message: 'User Access Denied.'
        })
    }

    next();
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({
            message: 'Admin Access Denied.'
        })
    }

    next();
};