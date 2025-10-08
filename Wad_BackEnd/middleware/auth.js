// Wad_BackEnd/middleware/auth.js

import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("CRITICAL SERVER ERROR: JWT_SECRET is not defined.");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Token is missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token is not valid.' });
    }
};

export default authenticateJWT;