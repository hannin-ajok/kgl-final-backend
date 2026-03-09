const allowRoles = (...roles) => {
  return (req, res, next) => {
    // Block the request early when the logged-in role isn't allowed on this route.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    next();
  };
};

module.exports = { allowRoles };
