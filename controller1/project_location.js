const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getAllProjectLocation = async (req, res) => {
  try {
    const data = await connection.query(
      `select * from locations where status >= 0`
    );

    if (data[0].length > 0) {
      return res.status(200).json({
        status: true,
        data: data[0],
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
      error: error.message,
    });
  }
};

const createlocation = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      name,
      latitude,
      longitude,
      location_advantage,
      slug,
      status,
      meta_title,
      meta_description,
    } = req.body;
    const data = await connection.query(
      "INSERT INTO locations (name,latitude,longitude,location_advantage,slug,meta_title,meta_description,ip,status) VALUES (?, ?, ?, ?,?, ?,?,?,?)",
      [
        name,
        latitude,
        longitude,
        location_advantage,
        slug,
        meta_title,
        meta_description,
        clientIP,
        status,
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
      error: error.message,
    });
  }
};

const getbyidlocation = async (req, res) => {
  try {
    const { pl_id } = req.params;
    if (!pl_id) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
    const data = await connection.query(
      "SELECT * from locations where pl_id=?",
      [pl_id]
    );
    if (data[0][0]?.pl_id) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidlocation = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { pl_id } = req.params;
    if (!pl_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const {
      name,
      latitude,
      longitude,
      location_advantage,
      slug,
      meta_title,
      meta_description,
    } = req.body;
    const data = await connection.query(
      "update locations set name=?,latitude=?,longitude=?,location_advantage=?,slug=?,meta_title=?,meta_description=?,ip=? where pl_id=?",
      [
        name,
        latitude,
        longitude,
        location_advantage,
        slug,
        meta_title,
        meta_description,
        clientIP,
        pl_id,
      ]
    );

    if (data[0].changedRows) {
      res.status(200).json({
        status: true,
        data: data[0],
        ip: clientIP,
        message: "data update successfully",
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
      message: error.message,
    });
  }
};

const deletebyidlocation = async (req, res) => {
  try {
    const { pl_id } = req.params;
    if (!pl_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "update locations set status=-1 WHERE pl_id=?",
      [pl_id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: " Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
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
      error: error.message,
    });
  }
};

module.exports = {
  getAllProjectLocation,
  createlocation,
  getbyidlocation,
  updatebyidlocation,
  deletebyidlocation,
};
