const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallmanagement = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from management where status >= 0"
    );

    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "data fetch successfully.",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "record not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getbyidmanagement = async (req, res) => {
  try {
    const { management_id } = req.params;

    if (!management_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "select * from management where management_id=? ",
      [management_id]
    );

    if (data[0][0]?.management_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "failed not found",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

const createmanagement = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { name, image, description, designation, status } = req.body;
    const data = await connection.query(
      "insert into management(name,image,description,designation,status,ip)values(?,?,?,?,?,?)",
      [name, image, description, designation, status, clientIP]
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

const updatebyidmanagement = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { management_id } = req.params;

    if (!management_id) {
      return res.status(404).json({
        status: false,
        message: "Id not present",
      });
    }

    const { name, image, description, designation, status } = req.body;

    const data = await connection.query(
      "UPDATE management SET name=?,image=?,description=?,designation=?,status=?,ip=? where management_id=?",
      [name, image, description, designation, status, clientIP, management_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        data: data[0],
        ip: clientIP,
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
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

const deletebyidmanagement = async (req, res) => {
  try {
    const { management_id } = req.params;

    if (!management_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "update management set status=-1 where management_id=? ",
      [management_id]
    );

    if (data[0].affectedRows) {
      return res.status(200).json({
        status: true,
        message: "Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
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

const updatebyidmanagementstatus = async (req, res) => {
  try {
    const { management_id } = req.params;

    if (!management_id) {
      return res.status(404).json({
        status: false,
        message: "Id not present",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "UPDATE management SET status=? where management_id=?",
      [status, management_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "data update successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
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
module.exports = {
  getallmanagement,
  getbyidmanagement,
  createmanagement,
  updatebyidmanagement,
  deletebyidmanagement,
  updatebyidmanagementstatus,
};
