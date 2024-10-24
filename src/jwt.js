const jwt = require('jsonwebtoken');
const blacklist = [];

const generateToken = (user) => {
    const payload = { id: user.id, role: user.role };
    return jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
};

const verifyToken = (token) => {
    if (blacklist.includes(token)) {
        throw new Error('Token is blacklisted');
    }
    return jwt.verify(token, 'your_secret_key');
};

const blacklistToken = (token) => {
    blacklist.push(token);
};

module.exports = { generateToken, verifyToken, blacklistToken };
