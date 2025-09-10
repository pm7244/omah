const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallEnquiry = async (req, res) => {
  try {
    const data = await connection.query(
      " SELECT * FROM enquiries where enquiry_status >= 0 "
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

const getbyidenquiries = async (req, res) => {
  try {
    const { enquiry_id } = req.params;
    if (!enquiry_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }
    const data = await connection.query(
      "select * from enquiries where enquiry_id = ?",
      [enquiry_id]
    );

    if (data[0][0]?.enquiry_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
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
      error: error.message,
    });
  }
};

const createenquiries = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      project_id,
      name,
      email,
      phone_no,
      message,
      form_location,
      enquiry_status,
      status,
    } = req.body;
    const data = await connection.query(
      "insert into enquiries(project_id,name ,email,phone_no,message,form_location,enquiry_status,status,ip) values (?,?,?,?,?,?,?,?,?)",
      [
        project_id,
        name,
        email,
        phone_no,
        message,
        form_location,
        enquiry_status,
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
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const updatebyidenquiries = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { enquiry_id } = req.params;
    if (!enquiry_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const {
      project_id,
      name,
      email,
      phone_no,
      message,
      form_location,
      enquiry_status,
      status,
    } = req.body;
    const data = await connection.query(
      "UPDATE enquiries SET project_id=?, name=?, email=?, phone_no=?, message=?, form_location=?, enquiry_status=?, status=?,ip=? WHERE enquiry_id=?",
      [
        project_id,
        name,
        email,
        phone_no,
        message,
        form_location,
        enquiry_status,
        status,
        clientIP,
        enquiry_id,
      ]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        data: data[0],
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const deletebyidenquiries = async (req, res) => {
  try {
    const { enquiry_id } = req.params;
    if (!enquiry_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "UPDATE enquiries SET  enquiry_status=-1 WHERE enquiry_id=?",
      [enquiry_id]
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

const updatebyidenquirystatus = async (req, res) => {
  try {
    const { enquiry_id } = req.params;
    if (!enquiry_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const { enquiry_status } = req.body;
    const data = await connection.query(
      "UPDATE enquiries SET  enquiry_status=?  WHERE enquiry_id=?",
      [enquiry_status, enquiry_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: " data update successfully",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getallEnquiry,
  getbyidenquiries,
  createenquiries,
  updatebyidenquiries,
  deletebyidenquiries,
  updatebyidenquirystatus,
};
