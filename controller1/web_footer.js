const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallwebfooter = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_footer where status >=0"
   
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

const getbyidwebfooter = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from web_footer where id = ? AND status >= 0",
      [id]
    );
    if (data[0][0]?.id) {
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

const createwebfooter = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { footer_logo, footer_description, status } = req.body;

    const data = await connection.query(
      "INSERT INTO web_footer (footer_logo,footer_description,status,ip) VALUES (?,?,?,?)",
      [footer_logo, footer_description, status, clientIP]
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

const updatebyidwebfooter = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { footer_logo, footer_description, status } = req.body;

    const data = await connection.query(
      "update web_footer set footer_logo=?,footer_description=?,status=?,ip=? where id=?",
      [footer_logo, footer_description, status, clientIP, id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "data update successfully",
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

const deletebyidwebfooter = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const data = await connection.query("update web_footer set status=-1 WHERE id=?", [
      id
    ]);

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

const updatebyidwebfooterstatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update web_footer set status=? where id=?",
      [status, id]
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
  getallwebfooter,
  getbyidwebfooter,
  createwebfooter,
  updatebyidwebfooter,
  updatebyidwebfooterstatus,
  deletebyidwebfooter,
};
