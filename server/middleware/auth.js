
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

module.exports = function(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const actualToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(actualToken, JWT_SECRET);
    req.admin = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};