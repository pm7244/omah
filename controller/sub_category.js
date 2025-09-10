const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallsubcategories = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT * FROM sub_category where status >= 0"
    );
    if (data && data[0].length > 0) {
      return res.status(200).json({
        message: "get all subcategories",
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
      message: error.message,
    });
  }
};

const getbyidsubcategory = async (req, res) => {
  try {
    const { sub_cat_id } = req.params;
    if (!sub_cat_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const data = await connection.query(
      "SELECT * FROM sub_category WHERE sub_cat_id = ?",
      [sub_cat_id]
    );
    if (data[0][0]?.sub_cat_id) {
      return res.status(200).json({
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
      message: error.message,
    });
  }
};

const createsubcategory = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { title, description, status } = req.body;
    const data = await connection.query(
      "INSERT INTO sub_category (title, description, status, ip) VALUES (?, ?, ?, ?)",
      [title, description, status, clientIP]
    );
    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidsubcategory = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { sub_cat_id } = req.params;
    if (!sub_cat_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const { title, description, status } = req.body;
    const data = await connection.query(
      "UPDATE sub_category SET title = ?, description = ?, status = ?, ip = ? WHERE sub_cat_id = ?",
      [title, description, status, clientIP, sub_cat_id]
    );
    if (data[0].changedRows) {
      res.status(200).json({
        status: true,
        message: "Data updated successfully",
        ip: clientIP,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidsubcategory = async (req, res) => {
  try {
    const { sub_cat_id } = req.params;
    if (!sub_cat_id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const data = await connection.query(
      "UPDATE sub_category SET status = -1 WHERE sub_cat_id = ?",
      [sub_cat_id]
    );

    if (data[0].affectedRows) {
      res.status(200).json({
        status: true,
        message: "Updated status successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Failed to update status",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateSubCatstatus = async (req, res) => {
  try {
    const { sub_cat_id } = req.params;
    if (!sub_cat_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "UPDATE sub_category SET status = ? WHERE sub_cat_id = ?",
      [status, sub_cat_id]
    );
    if (data[0].changedRows) {
      res.status(200).json({
        status: true,
        message: "Status updated successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Failed to update status",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getallsubcategories,
  getbyidsubcategory,
  createsubcategory,
  updatebyidsubcategory,
  deletebyidsubcategory,
  updateSubCatstatus,
};
