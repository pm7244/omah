const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallabout = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_about where status >=0"
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

const getbyidabout = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from web_about where id = ? AND status >= 0",
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

const createabout = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      hero_image,
      hero_title,
      hero_des,
      short_id,
      status,
      meta_title,
      meta_des
    } = req.body;

    const data = await connection.query(
      `INSERT INTO web_about (
        hero_image,
        hero_title,
        hero_des,
        short_id,
  
        status,
        ip,
        meta_title,
        meta_des
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hero_image,
        hero_title,
        hero_des,
        short_id,
        status,
        clientIP,
        meta_title,
        meta_des
      ]
    );

    return res.status(200).json({
      status: true,
      message: "About data inserted successfully",
      data: data[0],
      ip: clientIP,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


const updatebyidabout = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      hero_image,
      hero_title,
      hero_des,
      short_id,
      status,
      meta_title,
      meta_des
    } = req.body;

    const data = await connection.query(
      `UPDATE web_about SET 
        hero_image = ?, 
        hero_title = ?, 
        hero_des = ?, 
        short_id = ?, 
        status = ?, 
        ip = ?, 
        meta_title = ?, 
        meta_des = ?
      WHERE id = ?`,
      [
        hero_image,
        hero_title,
        hero_des,
        short_id,
        status,
        clientIP,
        meta_title,
        meta_des,
        id
      ]
    );

    if (data[0].changedRows > 0) {
      return res.status(200).json({
        status: true,
        message: "Data updated successfully",
        ip: clientIP,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No data changed or ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


const deletebyidabout = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id not present");
    }

    const data = await connection.query(
      "update web_about set status=-1 WHERE id=?",
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

const updatebyidaboutstatus = async (req, res) => {
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
      "update web_about set status=? where id=?",
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
  getallabout,
  getbyidabout,
  createabout,
  updatebyidabout,
  deletebyidabout,
  updatebyidaboutstatus,
};
