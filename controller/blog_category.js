const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallblog_category = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from blog_category where cat_status >=0"
    );

    if (data && data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "get all post",
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

const getbyidblog_category = async (req, res) => {
  try {
    const { category_id } = req.params;
    if (!category_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }
    const data = await connection.query(
      "select * from blog_category where category_id = ?",
      [category_id]
    );
    if (data[0][0]?.category_id) {
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

const createblog_category = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      name,
      description,
      sort_order,
      meta_title,
      meta_desc,
      cat_slug,
      cat_status,
    } = req.body;
    const data = await connection.query(
      "INSERT INTO blog_category (name,description,sort_order,meta_title,meta_desc,cat_slug,cat_status,ip) VALUES (?, ?, ?, ?, ?,?,?,?)",
      [
        name,
        description,
        sort_order,
        meta_title,
        meta_desc,
        cat_slug,
        cat_status,
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

const updatebyidblog_category = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { category_id } = req.params;
    if (!category_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const {
      name,
      description,
      sort_order,
      cat_status,
      cat_slug,
      meta_title,
      meta_desc,
    } = req.body;

    const data = await connection.query(
      "update blog_category set name=?,description=?,	sort_order=?,cat_status=?, cat_slug=?, meta_title=?,meta_desc=?,ip=? where category_id=?",
      [
        name,
        description,
        sort_order,
        cat_status,
        cat_slug,
        meta_title,
        meta_desc,
        clientIP,
        category_id,
      ]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        data: data[0],
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

const deletebyidblog_category = async (req, res) => {
  try {
      const { category_id } = req.params
      if (!category_id) {
          res.status(404).json({
              status: false,
              meaase: "ID not found"
          })
      }

      const data = await connection.query(
          "UPDATE awards SET cat_status=-1 WHERE category_id=?",
          [category_id]
      );

      if (data[0].affectedRows) {
          return res.json({
              status: true,
              message: " Deleted successfully"
          });
      } else if (data[0].affectedRows === 0) {
          return res.json({
              status: false,
              message: "Wrong ID"
          })
      } else {
          return res.json({
              status: false,
              message: "Failed to delete"
          })
      }
  } catch (error) {
      res.json({
          error: error.message
      })
  }
}

const updatebyidblog_categorystatus = async (req, res) => {
  try {
    const { category_id } = req.params;
    if (!category_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }
    const { cat_status } = req.body;

    const data = await connection.query(
      "update blog_category set cat_status=? where category_id=?",
      [cat_status, category_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "data update successfully",
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
  getallblog_category,
  getbyidblog_category,
  createblog_category,
  updatebyidblog_category,
  deletebyidblog_category,
  updatebyidblog_categorystatus,
};
