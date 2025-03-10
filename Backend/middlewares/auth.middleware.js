export const checkAdminCookie = (req, res, next) => {
    // Check if the "admin" cookie is available in the request
    const adminCookie = req.cookies?.admin;
  
    // If the "admin" cookie is not available, return an error response
    if (!adminCookie) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin cookie is missing.",
      });
    }
  
    // Optionally: Verify the admin cookie (e.g., JWT token or specific value)
    try {
      // Example: If the cookie is a JWT token, verify it
      const verifiedAdmin = jwt.verify(adminCookie, process.env.JWT_SECRET);
  
      // Attach the verified admin data to the request object for later use
      req.admin = verifiedAdmin;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin cookie. Authentication failed.",
      });
    }
  };
  