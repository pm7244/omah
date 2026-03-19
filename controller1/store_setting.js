const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallstore_setting = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from store_setting where status >=0"
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

const getbyidstore_setting = async (req, res) => {
  try {
    const { store_id } = req.params;
    if (!store_id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from store_setting where store_id = ? AND status >=0",
      [store_id]
    );
    if (data[0][0]?.store_id) {
      return res.json({
        status: true,
        data: data[0],
      });
    } else {
      return res.json({
        status: false,
        message: "failed to get data",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createstore_setting = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      name,
      tagline,
      overview,
      logo1,
      logo2,
      notify_email,
      career_email,
      conf_email,
      conf_password,
      conf_host,
      conf_port,
      conf_secure,
      meta_title,
      meta_desc,
      status,
    } = req.body;

    const data = await connection.query(
      "INSERT INTO store_setting (name,tagline,overview,logo1,logo2,notify_email,career_email,conf_email,conf_password,conf_host,conf_port,conf_secure,meta_title,meta_desc,status,ip) VALUES (?,?,?, ?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        tagline,
        overview,
        logo1,
        logo2,
        notify_email,
        career_email,
        conf_email,
        conf_password,
        conf_host,
        conf_port,
        conf_secure,
        meta_title,
        meta_desc,
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
const updatebyidstore_setting = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { store_id } = req.params;

    if (!store_id) {
      return res.status(400).json({
        status: false,
        message: "store_id is required",
      });
    }

    const {
      name,
      tagline,
      overview,
      logo1,
      logo2,
      notify_email,
      career_email,
      conf_email,
      conf_password,
      conf_host,
      conf_port,
      conf_secure,
      meta_title,
      meta_desc,
      status
    } = req.body;

    const data = await connection.query(
      `UPDATE store_setting SET 
        name = ?, tagline = ?, overview = ?, logo1 = ?, logo2 = ?, 
        notify_email = ?, career_email = ?, conf_email = ?, 
        conf_password = ?, conf_host = ?, conf_port = ?, conf_secure = ?, 
        meta_title = ?, meta_desc = ?, status = ?, ip = ? 
      WHERE store_id = ?`,
      [
        name, tagline, overview, logo1, logo2,
        notify_email, career_email, conf_email,
        conf_password, conf_host, conf_port, conf_secure,
        meta_title, meta_desc, status, clientIP,
        store_id
      ]
    );

    if (data[0].changedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Data updated successfully",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or invalid store_id",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidstore_setting = async (req, res) => {
  try {
    const { store_id } = req.params;
    if (!store_id) {
      throw new Error("Id not present");
    }

    const data = await connection.query(
      "update  store_setting set status=-1 WHERE store_id=?",
      [store_id]
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

const updatebyidstore_settingstatus = async (req, res) => {
  try {
    const { store_id } = req.params;
    if (!store_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update store_setting set status=? where store_id=?",
      [status, store_id]
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
  getallstore_setting,
  getbyidstore_setting,
  createstore_setting,
  updatebyidstore_setting,
  deletebyidstore_setting,
  updatebyidstore_settingstatus,
};
