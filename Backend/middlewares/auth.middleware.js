import jwt from 'jsonwebtoken';

// Verify user - checks both cookies and Authorization header
export const verifyUser = (req, res, next) => {
  try {
    // Check for token in cookies
    let token = req.cookies.user_token || req.cookies.admin_token;

    // Check for token in Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please login first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Verify admin - checks both cookies and Authorization header
export const verifyAdmin = (req, res, next) => {
  try {
    // Check for token in cookies
    let token = req.cookies.admin_token;

    // Check for token in Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};
