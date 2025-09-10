const connection = require("../connection");
const { getIP } = require("../controller/clientIP");


const getallprojectcontain = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT * FROM project_content WHERE status > 0"
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


const createProjectSection = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      p_id,
      layout_label,
      layoutType,
      img1,
      img2,
      text,
      sort_order,
      status,
    } = req.body;

    const data = await connection.query(
      `INSERT INTO project_content 
      (p_id, layout_label, layoutType, img1, img2, text, sort_order, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p_id,
        layout_label,
        layoutType,
        JSON.stringify(img1), 
        JSON.stringify(img2),
        text || null,
        sort_order,
        status,
      ]
    );

    res.status(200).json({
      status: true,
      message: "Project section created successfully",
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({
      status: false,
      message: "Error while creating project section",
      error: error.message,
    });
  }
};



const getbyidcontain = async (req, res) => {
  try {
    const { pc_id } = req.params;

    if (!pc_id) {
      return res.status(404).json({
        status: false,
        message: "ID not provided",
      });
    }

    const [rows] = await connection.query(
      "SELECT * FROM project_content WHERE pc_id = ?",
      [pc_id]
    );

    if (rows.length > 0) {
      return res.json({
        status: true,
        message: "Data fetched successfully",
        data: rows[0], 
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No record found with this ID",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error while fetching data",
      error: error.message,
    });
  }
};





const updategetcontainById = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { pc_id } = req.params;

    if (!pc_id) {
      return res.status(400).json({
        status: false,
        message: "Section ID is required",
      });
    }

    const {
      p_id,
      layoutType,
      layout_label,
      img1,
      img2,
      text,
      sort_order,
      status,
    } = req.body;

    const result = await connection.query(
      `UPDATE project_content 
       SET 
         p_id = ?, 
         layoutType = ?, 
         layout_label = ?, 
         img1 = ?, 
         img2 = ?, 
         text = ?, 
         sort_order = ?, 
         status = ?,
         ip = ?
       WHERE pc_id = ?`,
      [
        p_id,
        layoutType,
        layout_label,
        JSON.stringify(img1),
        JSON.stringify(img2),
        text || null,
        sort_order || 0,
        status ,
        clientIP,
        pc_id,
      ]
    );

    if (result[0].changedRows > 0) {
      return res.json({
        status: true,
        message: "Project section updated successfully",
        ip: clientIP,
      });
    } else {
      return res.json({
        status: false,
        message: "No changes made or invalid ID",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update project section",
      error: error.message,
    });
  }
};



const deletebyidcontain = async (req, res) => {
  try {
    const {  pc_id } = req.params;
    if (! pc_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "update project_content set status=-1 WHERE  pc_id=?",
      [ pc_id]
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

module.exports = { createProjectSection , getallprojectcontain , getbyidcontain, updategetcontainById , deletebyidcontain};
