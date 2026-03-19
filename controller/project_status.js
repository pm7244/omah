const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getAllProjectStatus = async (req, res) => {
  try {
    const data = await connection.query(
      `select * from project_status where status >=0`
    );

    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "data not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const createstatus = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { name, slug, meta_title, meta_description, status } = req.body;

    const data = await connection.query(
      "INSERT INTO project_status (name,slug,meta_title,meta_description,status,ip) VALUES (?, ?,?, ?, ?, ?)",
      [name, slug, meta_title, meta_description, status, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const getbyidstatus = async (req, res) => {
  try {
    const { ps_id } = req.params;

    const data = await connection.query(
      "SELECT * from project_status where ps_id=? and status >=0",
      [ps_id]
    );
    if (data[0][0]?.ps_id) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidstatus = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { ps_id } = req.params;
    if (!ps_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const { name, slug, meta_title, meta_description, status } = req.body;
    const data = await connection.query(
      "update project_status set name=?,slug=?,meta_title=?,meta_description=?,status=?,ip=? where ps_id=?",
      [name, slug, meta_title, meta_description, status, clientIP, ps_id]
    );

    if (data[0].changedRows) {
      res.status(200).json({
        status: true,
        data: data[0],
        ip: clientIP,
        message: "data update successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidstatus = async (req, res) => {
  try {
    const { ps_id } = req.params;
    if (!ps_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "update project_status set status=-1 WHERE ps_id=?",
      [ps_id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: " Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
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
      error: error.message,
    });
  }
};

module.exports = {
  getAllProjectStatus,
  createstatus,
  getbyidstatus,
  updatebyidstatus,
  deletebyidstatus,
};
