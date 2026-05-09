const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader)
    return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function restaurantOnly(req, res, next) {
  if (req.user.user_type !== 'restaurant')
    return res.status(403).json({ error: 'Restaurants only' });

  next();
}

module.exports = {
  verifyToken,
  restaurantOnly
};