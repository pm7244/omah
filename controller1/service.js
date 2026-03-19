const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallservice = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT  * from service where status >=0 "
    );
    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "data fetch successfull",
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

const getbyidservice = async (req, res) => {
  try {
    const { s_id } = req.params;

    if (!s_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const data = await connection.query(
      "SELECT * from service where s_id =?",
      [s_id]
    );
    if (data[0][0].s_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
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

const createservice = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { title, des, tag, slug, status, image } = req.body;

    const result = await connection.query(
      `INSERT INTO service (title, des, tag, slug, ip, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, des, tag, slug, clientIP, status, image]
    );

    res.status(200).json({
      status: true,
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



const updatebyidservice = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { s_id } = req.params;

    if (!s_id) {
      return res.status(400).json({
        status: false,
        message: "Service ID not provided",
      });
    }

    const { title, des, tag, slug, status, image } = req.body;

    const [data] = await connection.query(
      `UPDATE service SET title=?, des=?, tag=?, slug=?, status=?, image=?, ip=? WHERE s_id=?`,
      [title, des, tag, slug, status, image, clientIP, s_id]
    );

    if (data.changedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Service updated successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No changes made or service not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const updatebyidservicestatus = async (req, res) => {
  try {
    const { s_id } = req.params;
    if (!s_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "UPDATE service SET status=? where s_id=?",
      [status, s_id]
    );
    if (data[0].changedRows) {
      res.status(404).json({
        status: true,
        message: "status update successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "status not update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidservice = async (req, res) => {
  try {
    const { s_id } = req.params;

    if (!s_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }
    const data = await connection.query(
      "UPDATE service SET status=-1 WHERE s_id=?",
      [s_id]
    );


    if (data[0].affectedRows == 1) {
      return res.status(200).json({
        status: true,
        message: "deleted successfully",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to delete",
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
  getallservice,
  getbyidservice,
  createservice,
  updatebyidservice,
  updatebyidservicestatus,
  deletebyidservice,
};
