const connection = require("../connection");
const { getIP } = require("./clientIP");

const getalljob = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from job_positions where status >= 0"
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

const getbyidjob = async (req, res) => {
  try {
    const { job_id } = req.params;
    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "select * from job_positions where job_id = ?",
      [job_id]
    );

    if (data[0][0]?.job_id) {
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
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createjob = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { title, description, experience, location, status } = req.body;

    const data = await connection.query(
      "insert into job_positions(title,description,experience,location,status,ip)values(?,?,?,?,?,?)",
      [title, description, experience, location, status, clientIP]
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

const updatebyidjob = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const { title, description, experience, location, status } = req.body;

    const data = await connection.query(
      "update job_positions set title=?,description=?,experience=?, location=?,status=?,ip=? where job_id=?  ",
      [title, description, experience, location, status, clientIP, job_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "data update successfully",
        ip: clientIP,
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
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

const deletebyidjob = async (req, res) => {
  try {
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "update job_positions set status=-1 where job_id=? ",
      [job_id]
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

const updatebyidjobstatus = async (req, res) => {
  try {
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "update job_positions set status=? where job_id=?",
      [status, job_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "data update successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
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
  getalljob,
  getbyidjob,
  createjob,
  updatebyidjob,
  deletebyidjob,
  updatebyidjobstatus,
};
