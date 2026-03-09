const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Support legacy branch names so old records still authenticate cleanly.
const BRANCH_ALIASES = {
  'branch 1': 'branch maganjo',
  'Branch 1': 'branch maganjo',
  branch1: 'branch maganjo',
  'branch 2': 'branch matugga',
  'Branch 2': 'branch matugga',
  branch2: 'branch matugga'
};

const normalizeBranch = (branch) => BRANCH_ALIASES[branch] || branch;

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pull the token from "Bearer <token>".
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach current user info (without password) so downstream handlers can use it.
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user?.branch) {
        const normalized = normalizeBranch(req.user.branch);
        if (normalized !== req.user.branch) {
          req.user.branch = normalized;
          // Keep DB value consistent without blocking request flow.
          User.updateOne({ _id: req.user._id }, { branch: normalized }).catch(() => {});
        }
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
