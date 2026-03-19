const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallblog = async (req, res) => {
  try {
    const data = await connection.query("select * from blog WHERE status >=0");

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

const getbyidblog = async (req, res) => {
  try {
    const { blog_id } = req.params;
    if (!blog_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "select * from blog where blog_id= ? ",
      [blog_id]
    );
    if (data[0][0]?.blog_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Data not found ",
      });
    }
  } catch (error) {
    res.status(500).json({
      stattus: false,
      message: error.message,
    });
  }
};

const createblog = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      author_photo,
      author_name,
      title,
      des,
      tag,
      display_date,
      slug,
      status
    } = req.body;

    const data = await connection.query(
      `INSERT INTO blog (
        author_photo, 
        author_name, 
        title, 
        des, 
        tag, 
        display_date, 
        slug, 
        status, 
        ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        author_photo,
        author_name,
        title,
        des,
        tag,
        display_date,
        slug,
        status,
        clientIP
      ]
    );

    res.status(200).json({
      status: true,
      message: "Blog created successfully",
      data: data[0],
      ip: clientIP
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};


const updatebyidblog = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { blog_id } = req.params;

    if (!blog_id) {
      return res.status(400).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      author_photo,
      author_name,
      title,
      des,
      tag,
      display_date,
      slug,
      status,
    } = req.body;

    const data = await connection.query(
      `UPDATE blog SET 
        author_photo = ?, 
        author_name = ?, 
        title = ?, 
        des = ?, 
        tag = ?, 
        display_date = ?, 
        slug = ?, 
        status = ?, 
        ip = ? 
      WHERE blog_id = ?`,
      [
        author_photo,
        author_name,
        title,
        des,
        tag,
        display_date,
        slug,
        status,
        clientIP,
        blog_id,
      ]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "Blog updated successfully",
        data: data[0],
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or blog not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


const deletebyidblog = async (req, res) => {
  try {
    const { blog_id } = req.params;

    const data = await connection.query(
      "UPDATE blog SET status=-1 WHERE blog_id =?",
      [blog_id]
    );

    if (data[0].affectedRows) {
      return res.status(200).json({
        status: true,
        message: " Deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Failed to delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const updatebyidblogsstatus = async (req, res) => {
  try {
    const { blog_id } = req.params;
    if (!blog_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const { status } = req.body;
    const data = await connection.query(
      "UPDATE blog SET status=?  WHERE blog_id =?",
      [status, blog_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "update data successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getallblog,
  getbyidblog,
  createblog,
  updatebyidblog,
  deletebyidblog,
  updatebyidblogsstatus,
};
