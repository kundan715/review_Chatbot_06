// backend/controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// i keep token expiry as 7 days so user dont get logged out too fast
const JWT_EXPIRES_IN = "7d";

// helper function to generate token - i dont want to repeat this code in both register and login
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email }, // this is the payload - what gets encoded inside token
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// ── REGISTER ────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation - i check all fields before touching database
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields are requried" });
    }

    // password length check - short passwords are security risk
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 charecters" });
    }

    // check if email already registered - mongoose unique doesnt give nice error message
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "email already registerd" });
    }

    // bcrypt hash - 10 salt rounds is good balance between security and speed
    // higher rounds = more secure but slower, 10 is industry standard for most apps
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create user in database
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // generate token right after register so user is logged in immediately
    const token = generateToken(newUser._id, newUser.email);

    // i never send passwordHash back to frontend, ever
    res.status(201).json({
      message: "account created succesfuly",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("register error:", error.message);
    res.status(500).json({ message: "server error during registration" });
  }
};

// ── LOGIN ────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are requried" });
    }

    // find user by email - i use lowercase because i store all emails lowercase
    const user = await User.findOne({ email: email.toLowerCase() });

    // i give same error for wrong email and wrong password on purpose
    // giving different errors helps attackers know if email exists in system
    if (!user) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    // compare plain password with stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    // generate fresh token on every login
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      message: "login succesfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ message: "server error during login" });
  }
};

module.exports = { register, login };