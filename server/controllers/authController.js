const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(400).json({ error: "User not found" });

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const token = jwt.sign({ username, id: userDoc._id }, secret);
      res.cookie("token", token, { httpOnly: true }).json({
        id: userDoc._id,
        username,
      });
    } else {
      res.status(400).json({ error: "Wrong credentials" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.profile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    res.json(info);
  });
};

exports.logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true }).json({ message: "Logged out" });
};
