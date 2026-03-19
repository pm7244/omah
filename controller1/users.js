const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallusers = async (req, res) => {
  try {
    const data = await connection.query("select * from users where status >=0");

    if (data && data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "get all post",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const getbyidusers = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from users where user_id  = ?",
      [user_id]
    );
    if (data[0][0]?.user_id) {
      return res.json({
        status: true,
        data: data[0],
      });
    } else {
      return res.json({
        status: false,
        message: "Id not present",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createusers = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { username, password, status } = req.body;

    const data = await connection.query(
      "INSERT INTO users (username,password,status,ip) VALUES (?,?, ?, ?)",
      [username, password, status, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const updatebyidusers = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { user_id } = req.params;
    if (!user_id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const { 
      username, 
      password, 
      status, 
      email, 
      full_name, 
      phone,
      address,
      bio,
      profile_image 
    } = req.body;

    // Check if we have additional profile fields or just basic user fields
    if (email !== undefined || full_name !== undefined || profile_image !== undefined) {
      // Enhanced update with profile fields
      let updateQuery = `UPDATE users SET 
         username=?, 
         status=?, 
         email=?, 
         full_name=?, 
         phone=?, 
         address=?, 
         bio=?, 
         profile_image=?, 
         ip=?`;
      
      let updateParams = [
        username, 
        status, 
        email || null, 
        full_name || null, 
        phone || null, 
        address || null, 
        bio || null, 
        profile_image || null, 
        clientIP
      ];

      // Only update password if provided
      if (password) {
        updateQuery = updateQuery.replace('username=?,', 'username=?, password=?,');
        updateParams.splice(1, 0, password);
      }

      updateQuery += ' WHERE user_id=?';
      updateParams.push(user_id);

      const data = await connection.query(updateQuery, updateParams);

      if (data[0].changedRows >= 0) {
        return res.json({
          status: true,
          data: data[0],
          ip: clientIP,
          message: "Profile updated successfully"
        });
      } else {
        return res.json({
          status: false,
          message: "Failed to update profile",
        });
      }
    } else {
      // Basic update with original fields
      const data = await connection.query(
        "update users set username=?,password=?,status=?,ip=? where user_id=?",
        [username, password, status, clientIP, user_id]
      );

      if (data[0].changedRows >= 0) {
        return res.json({
          status: true,
          data: data[0],
          ip: clientIP,
        });
      } else {
        return res.json({
          status: false,
          message: "Failed to update",
        });
      }
    }
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
};

const deletebyidusers = async (req, res) => {
  try {
      const { user_id } = req.params
      if (!user_id ) {
          res.status(404).json({
              status:false,
              message:"id not found"
          })
      }

      const data = await connection.query("update users set status=-1 WHERE user_id=?", [user_id ]);

      if (data[0].affectedRows) {
          return res.json({
              status: true,
              ip:clientIP,
              message: " Deleted successfully"
          });
      }
       else {
          return res.json({
              status: false,
              message: "Failed to delete"
          })
      }
  } catch (error) {
      res.json({
          status:false,
          error: error.message
      })
  }
}

const updatepassword = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { user_id } = req.params;
    const { current_password, new_password } = req.body;

    if (!user_id) {
      return res.status(404).json({
        status: false,
        message: "User ID not found",
      });
    }

    if (!current_password || !new_password) {
      return res.status(400).json({
        status: false,
        message: "Current password and new password are required",
      });
    }

    // First, verify the current password
    const userData = await connection.query(
      "SELECT password FROM users WHERE user_id = ?",
      [user_id]
    );

    if (!userData[0][0]) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Simple password verification (you might want to use bcrypt for production)
    if (userData[0][0].password !== current_password) {
      return res.status(400).json({
        status: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    const updateResult = await connection.query(
      "UPDATE users SET password=?, ip=? WHERE user_id=?",
      [new_password, clientIP, user_id]
    );

    if (updateResult[0].changedRows > 0) {
      return res.json({
        status: true,
        message: "Password updated successfully",
        ip: clientIP,
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to update password",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const updatebyidassociateuserstatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "update users set status=? where user_id=?",
      [status, user_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "data Update successfully",
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

module.exports = {
  getallusers,
  getbyidusers,
  createusers,
  updatebyidusers,
  deletebyidusers,
  updatebyidassociateuserstatus,
  updatepassword,
};
