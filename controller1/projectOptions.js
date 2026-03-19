const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getAllProjectOption = async (req, res) => {
  try {
    const data = await connection.query(
      `SELECT  p.cat_id AS p_cat_id, p.title AS p_title, p.meta_title AS p_meta_title, p.meta_description AS p_meta_description, p.description AS p_description, p.slug AS p_slug, p.cover_url AS p_cover_url, p.over_view AS p_over_view, p.cover_type AS p_cover_type, p.listing_image AS p_listing_image, p.specification, p.plans, p.gallery_images, p.short_des AS p_short_desc, p.brochure, p.status AS p_status,o.cat_id AS option_cat_id,o.name AS option_name,o.value AS option_value,o.options_status  FROM project_options AS po JOIN projects AS p ON po.project_id=p.project_id JOIN options AS o ON po.options_id=o.options_id where status >= 0`
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

const createproject_option = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { project_id, options_id } = req.body;
    const data = await connection.query(
      "INSERT INTO project_options (project_id,options_id,ip) VALUES (?, ?, ?)",
      [project_id, options_id, clientIP]
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

const getallproject_option = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT po.po_id,p.cat_id,p.title,p.meta_title,p.meta_description,p.description,p.slug,p.cover_url,p.over_view,p.cover_type,p.listing_image,p.specification,p.location_advantages,p.plans,p.gallery_images,p.short_des,p.brochure,p.status,p.ip, o.name,o.value,o.cat_id,o.options_status from project_options po  JOIN projects p ON po.project_id = p.project_id JOIN options o ON po.options_id = o.options_id "
    );

    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        staus: false,
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

const getbyidproject_option = async (req, res) => {
  try {
    const { po_id } = req.params;
    if (!po_id) {
      res.status(500).json({
        status: false,
        message: "id not found",
      });
    }
    const data = await connection.query(
      "SELECT * from project_options where po_id=?",
      [po_id]
    );
    if (data[0][0]?.po_id) {
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

const deletebyidproject_option = async (req, res) => {
  try {
    const { po_id } = req.params;
    if (!po_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "update project_options set status=-1 WHERE po_id=?",
      [po_id]
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
  getAllProjectOption,
  createproject_option,
  getallproject_option,
  getbyidproject_option,
  deletebyidproject_option,
};
