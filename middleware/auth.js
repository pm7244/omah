const connection = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// =========================
// REGISTER USER
// =========================
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, password, status, ip) VALUES (?, ?, ?, ?)`;

    const data = await connection.query(sql, [
      username,
      hashedPassword,
      1,       // default active
      "::1",
    ]);

    if (data) {
      return res.status(200).json({
        status: true,
        message: "User created successfully",
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Failed to create user",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch only active users
    const sql = "SELECT * FROM users WHERE username = ? AND status = 1";
    const data = await connection.query(sql, [username]);
    const user = data[0];

    // If no active user found
    if (!user || user.length === 0) {
      return res.status(401).json({
        error: "User does not exist or is inactive",
      });
    }

    const storedPassword = user[0].password;

    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Create token with user ID
    const token = jwt.sign({ userId: user[0].id }, "jwttoken", {
      expiresIn: "24h",
    });

    // Store JWT in cookie
    res.cookie("jwt", token);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =========================
// LOGOUT USER
// =========================
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { register, login, logout };
