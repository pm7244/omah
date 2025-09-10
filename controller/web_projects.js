const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallwebproject = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_projects where project_status >=0 "
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

const getbyidwebproject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from web_projects where id = ?",
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

const createwebproject = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      meta_title,
      meta_description,
      title,
      breadcumb_name,
      slug,
      cover_url,
      short_description,
      description,
      sort_order,
      project_status,
    } = req.body;

    const data = await connection.query(
      "INSERT INTO web_projects (meta_title,meta_description,title,breadcumb_name,slug,cover_url,short_description,description,project_status,sort_order,ip) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        meta_title,
        meta_description,
        title,
        breadcumb_name,
        slug,
        cover_url,
        short_description,
        description,
        sort_order,
        project_status,
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

const updatebyidwebproject = async (req, res) => {
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
      meta_title,
      meta_description,
      title,
      breadcumb_name,
      slug,
      cover_url,
      short_description,
      description,
      sort_order,
      project_status,
    } = req.body;

    const data = await connection.query(
      "update web_projects set meta_title=?,meta_description=?,title=?,breadcumb_name=?,slug=?,cover_url=?,short_description=?,description=?,project_status=?,sort_order=?,ip=? where id=?",
      [
        meta_title,
        meta_description,
        title,
        breadcumb_name,
        slug,
        cover_url,
        short_description,
        description,
        sort_order,
        project_status,
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

const deletebyidwebproject = async (req, res) => {
  try {
      const { id } = req.params
      if (!id) {
          res.status(404).json({
              status:false,
              message:"ID not found"
          })
      }

      const data = await connection.query("update web_projects set project_status=-1  WHERE id=?", [id]);

      if (data[0].affectedRows) {
          return res.json({
              status: true,
              message: " Deleted successfully"
          });
      } else if (data[0].affectedRows === 0) {
          return res.status(404).json({
              status: false,
              message: "Wrong ID"
          });
      }else {
          return res.json({
              status: false,
              message: "Failed to delete"
          })
      }
  } catch (error) {
      res.json({
          status: false,
          error: error.message
      })
  }
}

const updatebyidwebprojectstatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { project_status } = req.body;

    const data = await connection.query(
      "update web_projects set project_status=? where id=?",
      [project_status, id]
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
  getallwebproject,
  getbyidwebproject,
  createwebproject,
  updatebyidwebproject,
  updatebyidwebprojectstatus,
  deletebyidwebproject,
};
