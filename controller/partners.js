const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallpartners = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from partners where status >=0"
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

const getbyidpartners = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from partners where id = ?",
      [id]
    );

    if (data[0][0]?.id) {
      return res.json({
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

const deletebyidpartners = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id not present");
    }

    const data = await connection.query(
      "update partners set status=-1 WHERE id=?",
      [id]
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

const createpartners = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { logo, status } = req.body;

    const data = await connection.query(
      "INSERT INTO partners (logo, status, ip) VALUES (?, ?, ?)",
      [logo, status, clientIP]
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

const updatebyidpartners = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { logo, status } = req.body;

    const data = await connection.query(
      "UPDATE partners SET logo = ?, status = ?, ip = ? WHERE id = ?",
      [logo, status, clientIP, id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "Data updated successfully",
        ip: clientIP,
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
  getallpartners,
  deletebyidpartners,
  updatebyidpartners,
  createpartners,
  getbyidpartners,
};

