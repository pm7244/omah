const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallsocial = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from social_links where status >=0"
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
      error: error.message,
    });
  }
};

const getbyidsocial = async (req, res) => {
  try {
    const { social_id } = req.params;

    if (!social_id) {
      return res.status(404).json({
        status: false,
        message: "ID not present",
      });
    }

    const data = await connection.query(
      "select * from social_links where social_id=?",
      [social_id]
    );

    if (data[0][0].social_id) {
      return res.status(200).json({
        status: true,
        message: data[0],
      });
    } else {
      res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createsocial = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { name, link, icon, status } = req.body;

    const data = await connection.query(
      "INSERT INTO social_links(name,link,icon,status,ip)values(?,?,?,?,?)",
      [name, link, icon, status, clientIP]
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

const updatebyidsocial = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { social_id } = req.params;

    if (!social_id) {
      res.status(404).json({
        status: false,
        message: " ID not present",
      });
    }

    const { name, link, icon, status } = req.body;

    const data = await connection.query(
      "UPDATE social_links SET name=?,link=?,icon=?,status=?,ip=? WHERE social_id=? ",
      [name, link, icon, status, clientIP, social_id, clientIP]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "updated successfully",
        ip: clientIP,
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
      message: error.message,
    });
  }
};

const deletebyidsocial = async (req, res) => {
  try {
    const { social_id } = req.params;

    if (!social_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }
    const data = await connection.query(
      "update social_links set status=-1 WHERE social_id=? ",
      [social_id]
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
const updatebyidsocialstatus = async (req, res) => {
  try {
    const { social_id } = req.params;
    if (!social_id) {
      res.status(404).json({
        status: false,
        message: " ID not present",
      });
    }

    const { status } = req.body;
    const data = await connection.query(
      "UPDATE social_links SET status=? WHERE social_id=? ",
      [status, social_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "updated successfully",
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
      message: error.message,
    });
  }
};

module.exports = {
  getallsocial,
  getbyidsocial,
  createsocial,
  updatebyidsocial,
  deletebyidsocial,
  updatebyidsocialstatus,
};
