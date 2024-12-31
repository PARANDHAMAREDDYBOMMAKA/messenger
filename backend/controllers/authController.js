const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/cryptoUtils");

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
