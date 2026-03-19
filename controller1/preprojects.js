const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallpreprojects = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from pre_projects where status >=0"
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

const getbyidpreprojects = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from pre_projects where p_id = ?",
      [id]
    );

    if (data[0][0]?.p_id) {
      return res.json({
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

const deletebyidpre_projects = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id not present");
    }

    const data = await connection.query(
      "update pre_projects set status=-1 WHERE p_id=?",
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

const createpreprojects = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      name,
      slug,
      address,
      lessee,
      points,
      status,
      image,
      cover_url,
      meta_title,
      meta_description,
      logo,
    } = req.body;

    const data = await connection.query(
      "INSERT INTO pre_projects (name,slug,address,lessee,points,status, image,cover_url,meta_title,meta_description, logo,ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        slug,
        address,
        lessee,
        points,
        status,
        image,
        cover_url,
        meta_title,
        meta_description,
        logo,
        clientIP,
      ]
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

const updatebyidpreprojects = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      name,
      slug,
      address,
      lessee,
      points,
      status,
      image,
      cover_url,
      meta_title,
      meta_description,
      logo,
    } = req.body;
    const data = await connection.query(
      "update pre_projects set name=?,slug=?,address=?,lessee=?,points=?,status=?, image=?,cover_url=?,meta_title=?,meta_description=?, logo=?,ip=? where p_id=?",
      [
        name,
        slug,
        address,
        lessee,
        points,
        status,
        image,
        cover_url,
        meta_title,
        meta_description,
        logo,
        clientIP,
        id,
      ]
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

module.exports = {
  getallpreprojects,
  deletebyidpre_projects,
  updatebyidpreprojects,
  createpreprojects,
  getbyidpreprojects,
};
