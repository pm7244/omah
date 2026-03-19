const connection = require("../../connection");

const {getIp} = require("../clientIP")

const getAllApplication = async (req, res) => {
  try {
    const [rows] = await connection.query( "SELECT * FROM application WHERE status = 1" );


    const applications = rows.map(item => {
      try {
        item.images = item.image ? JSON.parse(item.image) : [];
      } catch (e) {
        item.images = [item.image];
      }
      return item;
    });

    // Pass 'applications' array to EJS
    res.render("application", { applications }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getsapplicationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ status: false, message: "Slug is required" });
    }

    // ✅ Fetch current application by slug
    const [rows] = await connection.query(
      "SELECT * FROM application WHERE a_slug = ? AND status = 1 LIMIT 1",
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Application not found" });
    }

    const application = rows[0];

    // ✅ Parse JSON fields
    try {
      application.images = application.image ? JSON.parse(application.image) : [];
    } catch (e) {
      application.images = application.image ? [application.image] : [];
    }

    try {
      application.details_img = application.details_img ? JSON.parse(application.details_img) : [];
    } catch (e) {
      application.details_img = application.details_img ? [application.details_img] : [];
    }

    try {
      application.banner_img = application.banner_img ? JSON.parse(application.banner_img) : [];
    } catch (e) {
      application.banner_img = application.banner_img ? [application.banner_img] : [];
    }

    try {
      application.brochure = application.brochure ? JSON.parse(application.brochure) : [];
    } catch (e) {
      application.brochure = application.brochure ? [application.brochure] : [];
    }


    const [applications] = await connection.query(
      "SELECT applicant_id, title, a_slug FROM application WHERE status = 1"
    );

    // Render detail page with both data sets
    res.render("application_detail", { application, applications });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};




module.exports = {
  getAllApplication,
  getsapplicationBySlug
}; 