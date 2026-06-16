// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// this middleware runs before any protected route handler
// its job is simple - check token, if valid let request pass, if not block it

const authMiddleware = (req, res, next) => {
  try {
    // token comes in header like this -> Authorization: Bearer eyJhbG...
    const authHeader = req.headers.authorization;

    // if no header at all, block immediately
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "no token, access denied" });
    }

    // split "Bearer eyJhbG..." and take only the token part
    const token = authHeader.split(" ")[1];

    // jwt.verify will throw error if token is expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // i attach decoded payload to req.user so any controller can access it
    // decoded will have { userId, email } - i set this when token is created
    req.user = decoded;

    // pass control to next function (the actual controller)
    next();

  } catch (error) {
    // this catches expired tokens, invalid signature, malformed tokens
    return res.status(401).json({ message: "token is not valid" });
  }
};

module.exports = authMiddleware;