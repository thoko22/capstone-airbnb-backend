const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register user or host
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate that all required fields are provided
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Please provide username, email, password, and role." });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists." });
    }

    // Create a new user instance
    const user = new User({ username, email, password, role });

    // Save the user to the database
    await user.save();

    // Send a successful response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user or host
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate that email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
      res.status(200).json({ token, role: user.role });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };

