import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).send("Admin access denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send("Access denied");
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
