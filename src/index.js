const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app  = express();
app.use(cors());
app.use(express.json());
// serve everything inside /public at http://localhost:8080/
app.use(express.static("public"));

const SECRET = process.env.JWT_SECRET || "prometheus-secret";

// --- POST /signup --------------------------------------------------
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user   = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    const token  = jwt.sign({ id: user.id }, SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// --- POST /login ---------------------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, SECRET);
  res.json({ token, user: { name: user.name, email: user.email } });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`⚡ API running on port ${PORT}`));