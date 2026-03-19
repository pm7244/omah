const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallteam = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from team where status >= 0"
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

const getbyidteam = async (req, res) => {
  try {
    const { id  } = req.params;
    if (!id ) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

   const data = await connection.query(
  "SELECT * FROM team WHERE id  = ? AND status >= 0",
  [id ]
);
    if (data[0][0]?.id ) {
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

const createteam = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      image,
      name,
      designation,
      status
    } = req.body;

    const [data] = await connection.query(
      `INSERT INTO team (
        image,
        name,
        designation, 
        ip,
        status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        image,
        name,
        designation,
        clientIP,
        status
      ]
    );

    res.status(200).json({
      status: true,
      data,
      ip: clientIP
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

const updatebyidteam = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, message: "id not present" });
    }

    const { image, name, designation, status } = req.body;

    const [data] = await connection.query(
      `UPDATE team SET 
        image = ?,
        name = ?,
        designation = ?, 
        ip = ?, 
        status = ?
      WHERE id = ?`,
      [image, name, designation, clientIP, status, id]
    );

    if (data.affectedRows > 0) { 
      return res.status(200).json({
        status: true,
        message: "Successfully updated",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};



const deletebyidteam = async (req, res) => {
  try {
    const { id  } = req.params;
    if (!id ) {
      return res.status(400).json({
        status: false,
        message: "id  not present",
      });
    }

    const data = await connection.query(
      "update  team set status=-1 WHERE id =?",
      [id ]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: " Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to delete",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
};

const updatebyidteamstatus = async (req, res) => {
  try {
    const { id  } = req.params;
    if (!id ) {
      res.status(404).json({
        status: false,
        message: "id  not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update team set status=? where id =?",
      [status, id ]
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
  getallteam,
  getbyidteam,
  createteam,
  updatebyidteam,
  deletebyidteam,
  updatebyidteamstatus,
};
