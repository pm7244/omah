const connection = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: "Username and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (username, password, ip) VALUES (?, ?, ?)`;

    const data = await connection.query(sql, [username, hashedPassword, "::1"]);

    return res.status(200).json({
      status: true,
      message: "User created successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    const data = await connection.query(sql, [username]);
    const user = data[0];

    if (!user[0].username || !user[0].password) {
      return res.status(401).json({
        error: "Authentication failed: user and password not found",
      });
    }

    const storedPassword = user[0].password;

    try {
      const passwordMatch = await bcrypt.compare(password, storedPassword);

      if (!passwordMatch) {
        return res.status(401).json({
          error: "Authentication failed",
        });
      }

      const token = jwt.sign({ userId: user.id }, "jwttoken", {
        expiresIn: "24h",
      });
      res.cookie("jwt", token);
      console.log(token);

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error comparing passwords: ", error);
      res.status(500).json({
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error logging in: ", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "logout successfull",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { register, login, logout };
