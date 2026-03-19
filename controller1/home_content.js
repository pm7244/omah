const connection = require("../connection");
const { getIP } = require("./clientIP");

// Get all home content
const getallcontenthome = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT * FROM home_content WHERE status >= 0 ORDER BY CAST(NULLIF(sort_order, '') AS UNSIGNED) ASC, hc_id ASC"
    );

    if (data && data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(200).json({
        status: true,
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// Get content by ID
const getbyidcontenthome = async (req, res) => {
  try {
    const { hc_id } = req.params;
    
    if (!hc_id) {
      return res.status(404).json({
        status: false,
        message: "Content ID not found",
      });
    }

    const data = await connection.query(
      "SELECT * FROM home_content WHERE hc_id = ? AND status >= 0",
      [hc_id]
    );
    
    if (data[0][0]?.hc_id) {
      return res.json({
        status: true,
        data: data[0][0],
      });
    } else {
      return res.json({
        status: false,
        message: "Content not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// Create new home content
// Create home content
const createcontenthome = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      type,
      image1,
      image1_title,
      image1_des,
      image1_btn,
      image1_url,
      image_2,
      image2_title,
      image2_des,
      image2_btn,
      image2_url,
      text_title,
      text_des,
      text_btn,
      text_url,
      slug1,
      slug2,
      sort_order = 0,
      status = 1,
    } = req.body;

    // Validate required fields based on type
    if (!type) {
      return res.status(400).json({
        status: false,
        message: "Content type is required",
      });
    }

    // Type-specific validation
    if (type === 'image1') {
      if (!image1 || !image1_title) {
        return res.status(400).json({
          status: false,
          message: "Image and title are required for image1 type",
        });
      }
    } else if (type === 'image2') {
      if (!image1 || !image1_title || !image_2 || !image2_title) {
        return res.status(400).json({
          status: false,
          message: "Both images and titles are required for image2 type",
        });
      }
    } else if (type === 'text-image') {
      if (!text_title || !image1 || !image1_title) {
        return res.status(400).json({
          status: false,
          message: "Text title, image, and image title are required for text-image type",
        });
      }
    }

    // Get the next sort_order value if not provided
    let finalSortOrder = sort_order;
    if (!finalSortOrder || finalSortOrder === 0) {
      const countResult = await connection.query(
        "SELECT COUNT(*) as count FROM home_content WHERE status >= 0"
      );
      finalSortOrder = (countResult[0][0].count + 1).toString();
    }

    // Insert data
    const data = await connection.query(
      `INSERT INTO home_content (
        type,
        image1,
        image1_title,
        image1_des,
        image1_btn,
        image1_url,
        image_2,
        image2_title,
        image2_des,
        image2_btn,
        image2_url,
        text_title,
        text_des,
        text_btn,
        text_url,
        slug1,
        slug2,
        sort_order,
        ip,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        image1,
        image1_title,
        image1_des,
        image1_btn,
        image1_url,
        image_2,
        image2_title,
        image2_des,
        image2_btn,
        image2_url,
        text_title,
        text_des,
        text_btn,
        text_url,
        slug1,
        slug2,
        finalSortOrder,
        clientIP,
        status
      ]
    );

    res.status(200).json({
      status: true,
      data: {
        hc_id: data[0].insertId,
        message: "Home content created successfully"
      },
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


// Update home content by ID
const updatebyidcontenthome = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { hc_id } = req.params;

    if (!hc_id) {
      return res.status(400).json({
        status: false,
        message: "Content ID not present",
      });
    }

    const {
      type,
      image1,
      image1_title,
      image1_des,
      image1_btn,
      image1_url,
      image_2,
      image2_title,
      image2_des,
      image2_btn,
      image2_url,
      text_title,
      text_des,
      text_btn,
      text_url,
      slug1,
      slug2,
      sort_order = 0,
      status,
    } = req.body;

    const updated_at = new Date();

    const data = await connection.query(
      `UPDATE home_content SET 
        type = ?, 
        image1 = ?, 
        image1_title = ?, 
        image1_des = ?, 
        image1_btn = ?, 
        image1_url = ?, 
        image_2 = ?, 
        image2_title = ?, 
        image2_des = ?, 
        image2_btn = ?, 
        image2_url = ?, 
        text_title = ?, 
        text_des = ?, 
        text_btn = ?, 
        text_url = ?, 
        slug1 = ?, 
        slug2 = ?, 
        sort_order = ?, 
        ip = ?, 
        status = ?, 
        updated_at = ?
      WHERE hc_id = ?`,
      [
        type,
        image1,
        image1_title,
        image1_des,
        image1_btn,
        image1_url,
        image_2,
        image2_title,
        image2_des,
        image2_btn,
        image2_url,
        text_title,
        text_des,
        text_btn,
        text_url,
        slug1,
        slug2,
        sort_order,
        clientIP,
        status,
        updated_at,
        hc_id
      ]
    );

    if (data[0].changedRows || data[0].affectedRows) {
      return res.status(200).json({
        status: true,
        message: "Home content updated successfully",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or content not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


// Delete home content by ID
const deletebyicontenthome = async (req, res) => {
  try {
    const { hc_id } = req.params;
    
    if (!hc_id) {
      return res.status(400).json({
        status: false,
        message: "Content ID not present",
      });
    }

    const data = await connection.query(
      "UPDATE home_content SET status = -1 WHERE hc_id = ?",
      [hc_id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: "Home content deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Content not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// Update content status

module.exports = {
  getallcontenthome,
  getbyidcontenthome,
  createcontenthome,
  updatebyidcontenthome,
  deletebyicontenthome,
};
