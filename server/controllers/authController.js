import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function serializeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    stats: user.stats
  };
}

export async function signup(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required." });
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }]
  });

  if (existing) {
    return res.status(409).json({ message: "A player with those credentials already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email: email.toLowerCase(),
    passwordHash
  });

  return res.status(201).json({
    token: signToken(user),
    user: serializeUser(user)
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    token: signToken(user),
    user: serializeUser(user)
  });
}

export { serializeUser };
