const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallaboutcontent = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT * FROM about_content WHERE status >= 0 ORDER BY CAST(NULLIF(sort_order, '') AS UNSIGNED) ASC, ac_id ASC"
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

const getbyidaboutcontent = async (req, res) => {
  try {
    const { ac_id } = req.params;
    if (!ac_id ) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "select * from about_content where ac_id = ? AND status >= 0",
      [ac_id]
    );
    if (data[0][0]?.ac_id) {
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

const createaboutcontent = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      type,
      image,
      layout,
      title,
      des,
      sort_order,
      status
    } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({
        status: false,
        error: "Type is required"
      });
    }

    if (!image || !Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        status: false,
        error: "At least one image is required"
      });
    }

    // Get the next sort_order value if not provided
    let finalSortOrder = sort_order;
    if (!finalSortOrder || finalSortOrder === '' || finalSortOrder === '0') {
      const countResult = await connection.query(
        "SELECT COUNT(*) as count FROM about_content WHERE status >= 0"
      );
      finalSortOrder = (countResult[0][0].count + 1).toString();
    }

    const imageJson = JSON.stringify(image);

    const data = await connection.query(
      `INSERT INTO about_content (
        type,
        image,
        layout,
        title,
        des,
       sort_order,
        ip,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        imageJson,
        layout || "default",
        title || "",
        des || "",
       finalSortOrder,
        clientIP,
        status || 1
      ]
    );

    res.status(200).json({
      status: true,
      message: "Content inserted successfully.",
      data: data[0],
      ip: clientIP,
    });

  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};



const updatebyidaboutcontent = async (req, res) => {
  try {
    const clientIP = getIP(req); 
    const { ac_id } = req.params;

    if (!ac_id) {
      return res.status(400).json({ status: false, message: "ac_id is required." });
    }
    const [existing] = await connection.query(
      "SELECT ac_id FROM about_content WHERE ac_id = ?",
      [ac_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ status: false, message: "ac_id not found." });
    }

    const { image, layout, title, des, sort_order, status } = req.body;

    // Validate image if provided
    if (image && (!Array.isArray(image) || image.length === 0)) {
      return res.status(400).json({
        status: false,
        error: "Image must be a non-empty array if provided"
      });
    }

    const imageJson = Array.isArray(image) ? JSON.stringify(image) : image;

    const [result] = await connection.query(
      `UPDATE about_content 
       SET image = ?, 
           layout = ?,
           title = ?, 
           des = ?, 
          sort_order = ?,
           status = ?, 
           ip = ?
       WHERE ac_id = ?`,
      [ 
        imageJson,
        layout || "default",
        title || "",
        des || "",
        sort_order || 0,
        status || 1,
        clientIP,
        ac_id
      ]
    );

    return res.status(200).json({
      status: true,
      message: "Data updated successfully",
      ip: clientIP
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};



const deletebyidaboutcontent = async (req, res) => {
  try {
    const { ac_id  } = req.params;
    if (!ac_id ) {
      throw new Error("ac_id  not present");
    }

    const data = await connection.query(
      "update about_content set status=-1 WHERE ac_id =?",
      [ac_id ]
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


const updatebyidaboutstatuscontent = async (req, res) => {
  try {
    const { ac_id } = req.params;
    if (!ac_id ) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update about_content set status=? where ac_id=?",
      [status, ac_id]
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
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getallaboutcontent,
  getbyidaboutcontent,
  createaboutcontent,
  updatebyidaboutcontent,
  deletebyidaboutcontent,
  updatebyidaboutstatuscontent,
};