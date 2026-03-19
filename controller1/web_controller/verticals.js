const connection = require("../../connection");

const {getIp} = require("../clientIP")

const getAllverticals = async (req, res) => {
  try {
       const [verticals] = await connection.query(`select * from web_verticals where status=1`);
  
       

 res.render("verticals_details", {
        verticals: verticals.length > 0 ? verticals : null,

    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


const getVerticalBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ status: false, message: "Slug is required" });
    }

    const [rows] = await connection.query(
      "SELECT * FROM web_verticals WHERE slug = ? AND status = 1 LIMIT 1",
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Vertical not found" });
    }

    const vertical = rows[0];

    try {
  vertical.logo = vertical.logo ? JSON.parse(vertical.logo) : [];
} catch {
  vertical.logo = vertical.logo ? [vertical.logo] : [];
}


    // Parse images safely
    try {
      vertical.image = vertical.image ? JSON.parse(vertical.image) : [];
    } catch {
      vertical.image = vertical.image ? [vertical.image] : [];
    }

    try {
      vertical.banner_image = vertical.banner_image ? JSON.parse(vertical.banner_image) : [];
    } catch {
      vertical.banner_image = vertical.banner_image ? [vertical.banner_image] : [];
    }

    try {
      vertical.detail_img = vertical.detail_img ? JSON.parse(vertical.detail_img) : [];
    } catch {
      vertical.detail_img = vertical.detail_img ? [vertical.detail_img] : [];
    }

    // **Parse Application field**
    try {
      vertical.Application = vertical.Application ? JSON.parse(vertical.Application) : [];
    } catch {
      vertical.Application = vertical.Application ? [vertical.Application] : [];
    }

    try {
  vertical.why_vertical = vertical.why_vertical ? JSON.parse(vertical.why_vertical) : [];
} catch {
  vertical.why_vertical = vertical.why_vertical ? [vertical.why_vertical] : [];
}


try {
  vertical.brochure = vertical.brochure ? JSON.parse(vertical.brochure) : [];
} catch {
  vertical.brochure = vertical.brochure ? [vertical.brochure] : [];
}


    const [verticals] = await connection.query(
      "SELECT id, name, slug FROM web_verticals WHERE status = 1 ORDER BY sort_order ASC"
    );

    res.render("vertical_detail", { vertical, verticals });
  } catch (error) {
    console.error("Error fetching vertical detail:", error);
    res.status(500).json({ status: false, error: error.message });
  }
};


module.exports = {
  getAllverticals,
  getVerticalBySlug
}; 