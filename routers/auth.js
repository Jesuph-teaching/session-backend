const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { checkAuth, isLogged } = require("../middlewares/auth");
const { z } = require("zod");
const week = 7 * 24 * 60 * 60 * 1000;
const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
});

router.get("/", checkAuth, isLogged, (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json(user.toObject());
});

router.post("/register", async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  try {
    const user = new User(result.data);
    await user.save();
    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + week),
    });
    res.status(201).json({ user: user.toObject(), accessToken: token });
  } catch (error) {
    // if email is already taken
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already taken" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + week),
    });
    res.json({ user: user.toObject(), accessToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", checkAuth, isLogged, (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
