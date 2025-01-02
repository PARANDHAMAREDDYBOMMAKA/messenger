const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Fetch all users with only the username field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers };
