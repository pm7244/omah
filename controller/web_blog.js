const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallwebBlog = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_blog where status >=0"
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

const getbyidwebBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query("select * from web_blog where id = ?", [
      id,
    ]);
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

const createwebBlog = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      title,
      meta_title,
      meta_description,
      description,
      breadcrumb_name,
      slug,
      cover_url,
      status,
    } = req.body;

    const data = await connection.query(
      "INSERT INTO web_blog (title,meta_title,meta_description,description,breadcrumb_name,slug,cover_url,status,ip) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        title,
        meta_title,
        meta_description,
        description,
        breadcrumb_name,
        slug,
        cover_url,
        status,
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

const updatebyidwebBlog = async (req, res) => {
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
      title,
      meta_title,
      meta_description,
      description,
      breadcrumb_name,
      slug,
      cover_url,
      status,
    } = req.body;

    const data = await connection.query(
      "update web_blog set title=?,meta_title=?,meta_description=?,description=?,breadcrumb_name=?,slug=?,cover_url=?,status=?,ip=? where id=?",
      [
        title,
        meta_title,
        meta_description,
        description,
        breadcrumb_name,
        slug,
        cover_url,
        status,
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

const deletebyidwebBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const data = await connection.query("update web_blog set status=-1 WHERE id=?", [
      id,
    ]);

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
const updatebyidwebBlogstatus = async (req, res) => {
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
      "update web_blog set status=? where id=?",
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
  getallwebBlog,
  getbyidwebBlog,
  createwebBlog,
  updatebyidwebBlog,
  deletebyidwebBlog,
  updatebyidwebBlogstatus,
};
