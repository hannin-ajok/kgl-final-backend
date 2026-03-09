const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Keep token creation in one place so expiry and payload stay consistent.
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// @POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // Return one generic auth error so we don't leak which field was wrong.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, role: user.role, branch: user.branch }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, getMe };
