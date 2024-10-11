const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database and attach to the request object
    req.user = await User.findById(decoded.id).select("-password");

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed", error });
  }
};

module.exports = { protect };

