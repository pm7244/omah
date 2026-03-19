const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallteam = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT  * from team where status >=0 "
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

const getbyidteam = async (req, res) => {
  try {
    const { t_id } = req.params;

    if (!t_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const data = await connection.query(
      "SELECT * from team where t_id =?",
      [t_id]
    );
    if (data[0][0].t_id) {
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

const createteam = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { name, post, img, twitter, facebook, linkedin, status } = req.body;

    const result = await connection.query(
      `INSERT INTO team (name, post, img, twitter, facebook, linkedin, ip, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, post, img, twitter, facebook, linkedin, clientIP, status]
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



const updatebyidteam = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { t_id } = req.params;

    if (!t_id) {
      return res.status(400).json({
        status: false,
        message: "Team ID not provided",
      });
    }

    const { name, post, img, twitter, facebook, linkedin, status } = req.body;

    const [data] = await connection.query(
      `UPDATE team 
       SET name=?, post=?, img=?, twitter=?, facebook=?, linkedin=?, ip=?, status=? 
       WHERE t_id=?`,
      [name, post, img, twitter, facebook, linkedin, clientIP, status, t_id]
    );

    if (data.changedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Team updated successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No changes made or team not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const updatebyidteamstatus = async (req, res) => {
  try {
    const { t_id } = req.params;
    if (!t_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "UPDATE team SET status=? where t_id=?",
      [status, t_id]
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

const deletebyidteam = async (req, res) => {
  try {
    const { t_id } = req.params;

    if (!t_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }
    const data = await connection.query(
      "UPDATE team SET status=-1 WHERE t_id=?",
      [t_id]
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
  getallteam,
  getbyidteam,
  createteam,
  updatebyidteam,
  updatebyidteamstatus,
  deletebyidteam,
};
