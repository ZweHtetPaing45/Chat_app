const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, findUserByUsername } = require("../models/userModel");

const SECRET = "YOUR_SECRET_KEY";

exports.register = async (req, res) => {
  try {
    const db = req.db;
    const { username, name, password } = req.body;
    const image = req.file ? req.file.filename : null;

    const existing = await findUserByUsername(db, username);
    if (existing) return res.status(400).json({ message: "Username exists" });

    await createUser(db, { username, name, password, image });
    res.json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const db = req.db;
    const { username, password } = req.body;
    const user = await findUserByUsername(db, username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};