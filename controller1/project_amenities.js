const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallProjectAmenities = async (req, res) => {
  try {
    const data = await connection.query(
      `select * from amenities where amenities_status >=0`
    );

    if (data[0].length > 0) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      return res.status(404).json({
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

const createproject_amenities = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { name, slug, icon, amenities_status, sort_order } = req.body;
    const data = await connection.query(
      "INSERT INTO `amenities`( `name`, `slug`, `icon`, `amenities_status`, `sort_order`,`ip`) VALUES (?,?,?,?,?,?)",
      [name, slug, icon, amenities_status, sort_order, clientIP]
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

const getbyidproject_amenities = async (req, res) => {
  try {
    const { pa_id } = req.params;
    if (!pa_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const data = await connection.query(
      "SELECT * from  amenities  where amenities_id=? and amenities_status >=0",
      [pa_id]
    );
    if (data[0][0].amenities_id) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidproject_amenities = async (req, res) => {
  try {
    const { pa_id } = req.params;
    if (!pa_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "update amenities set amenities_status=-1 where amenities_id=?",
      [pa_id]
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

const updatebyidamenities = async (req, res) => {
  try {
    const { pa_id } = req.params;
    if (!pa_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const { name, slug, icon, sort_order, amenities_status } = req.body;

    const clientIP = getIP(req);

    const data = await connection.query(
      "update amenities set name=?,slug=?,icon=?,sort_order=?,ip=?, amenities_status=? where amenities_id=?",
      [name, slug, icon, sort_order, clientIP, amenities_status, pa_id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: " Updated successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to Update",
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

module.exports = {
  getallProjectAmenities,
  createproject_amenities,
  updatebyidamenities,
  getbyidproject_amenities,
  deletebyidproject_amenities,
};
