const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getalladdress = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from address where status >= 0"
    );

    if (data && data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
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

const getbyidaddress = async (req, res) => {
  try {
    const { address_id } = req.params;
    if (!address_id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from address where address_id = ? AND status >= 0",
      [address_id]
    );
    if (data[0][0]?.address_id) {
      return res.json({
        status: true,
        data: data[0],
      });
    } else {
      return res.json({
        status: false,
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createaddress = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      name,
      latitude,
      longitude,
      email,
      address,
      city,
      phone_no,
      status,
    } = req.body;

    const data = await connection.query(
      "INSERT INTO address (name, latitude, longitude,email, address, city, phone_no,status ,ip) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        name,
        latitude,
        longitude,
        email,
        address,
        city,
        phone_no,
        status,
        clientIP,
      ]
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

const updatebyidaddress = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { address_id } = req.params;

    if (!address_id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      name,
      email,
      address,
      city,
      phone_no,
      latitude,
      longitude,
      status
    } = req.body;

    const data = await connection.query(
      `UPDATE address SET 
        name = ?, 
        email = ?, 
        address = ?, 
        city = ?, 
        phone_no = ?, 
        latitude = ?, 
        longitude = ?, 
        status = ?, 
        ip = ? 
      WHERE address_id = ?`,
      [
        name,
        email,
        address,
        city,
        phone_no,
        latitude,
        longitude,
        status,
        clientIP,
        address_id
      ]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "Data updated successfully",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or invalid address_id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};



const deletebyidaddress = async (req, res) => {
  try {
      const { address_id } = req.params
      if (!address_id) {
          throw new Error("Id not present")
      }

      const data = await connection.query("UPDATE address SET status=-1 WHERE address_id=?", [address_id]);

      if (data[0].affectedRows) {
          return res.json({
              status: true,
              message: " Deleted successfully"
          });
      } else if (data[0].affectedRows === 0) {
          return res.status(404).json({
              status: false,
              message: "Wrong ID"
          });
      }else {
          return res.json({
              status: false,
              message: "Failed to delete"
          })
      }
  } catch (error) {
      res.json({
          status: false,
          error: error.message
      })
  }
}

const updatebyidaddressstatus = async (req, res) => {
  try {
    const { address_id } = req.params;
    if (!address_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update address set status=? where address_id=?",
      [status, address_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "status updated successfully",
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
  getalladdress,
  getbyidaddress,
  createaddress,
  updatebyidaddress,
  deletebyidaddress,
  updatebyidaddressstatus,
};
