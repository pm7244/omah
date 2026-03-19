const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallpreprojects = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_pre_projects where project_status >=0"
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

const updatebyidpreprojects = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    console.log(req.body);

    const {
      title,
      meta_title,
      meta_description,
      description,
      short_description,
      breadcrumb_name,
      cover_url,
      images,
      project_status,
      sort_order,
      slug,
    } = req.body;

    const data = await connection.query(
      "UPDATE web_pre_projects SET slug=?, title=?, meta_title=?, meta_description=?, description=?, short_description=?, breadcrumb_name=?, cover_url=?, project_status=?, sort_order=?, ip=? WHERE id=?",
      [
        slug,
        title,
        meta_title,
        meta_description,
        description,
        short_description,
        breadcrumb_name,
        cover_url,
        project_status,
        sort_order,
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
  updatebyidpreprojects,
};
