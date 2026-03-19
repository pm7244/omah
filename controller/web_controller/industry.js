const connection = require("../../connection");

const getAllindustry = async (req, res) => {
  try {
    const [industryData] = await connection.query(`SELECT * FROM web_industry WHERE status = 1`);
   const [serviceData] = await connection.query(`SELECT * FROM service_content WHERE status = 1 ORDER BY CAST(sort_order AS UNSIGNED) ASC`);
    const [footerRows]   = await connection.query("SELECT * FROM web_footer WHERE status = 1");
    const [addressRows]  = await connection.query("SELECT * FROM address WHERE status = 1");

    const footer = footerRows.length > 0 ? footerRows[0] : null;


    if (footer && footer.footer_logo) {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo);
      } catch {
        footer.footer_logo = [];
      }
    }

    if (industryData.length > 0) {
      const industry = {
        ...industryData[0],
        hero_image: JSON.parse(industryData[0].hero_image || "[]"),
      };

      const services = serviceData.map((item) => {
        let imageArr = [];
        try {
          const clean = JSON.parse(item.image);
          imageArr = Array.isArray(clean) ? clean : JSON.parse(clean);
        } catch (err) {
          imageArr = [];
        }

        return {
          ...item,
          image: imageArr,
        };
      });

      res.render("service", {
        industry,
        services,
        footer,
        addressList: addressRows
      });
    } else {
      res.status(404).render("error", { message: "Industry not found" });
    }
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const getalldetails = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).render("error", { message: "Slug is required" });
    }

    const [rows] = await connection.query(
      `SELECT * FROM service_content WHERE slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).render("error", { message: "Service not found" });
    }

    const serviceData = rows[0];


    const [mapRows] = await connection.query(
      `SELECT * FROM service_content_map WHERE sc_id = ? AND status = 1 ORDER BY sort_order ASC`,
      [serviceData.sc_id]
    );


    const [footerRows] = await connection.query(
      "SELECT * FROM web_footer WHERE status = 1"
    );
    const [addressRows] = await connection.query(
      "SELECT * FROM address WHERE status = 1"
    );


    const footer = footerRows.length > 0 ? footerRows[0] : null;
    if (footer && footer.footer_logo) {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo || "[]");
      } catch {
        footer.footer_logo = [];
      }
    }

    const parseArray = (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return val ? [val] : [];
      }
    };


    const map_items = mapRows.map((row) => ({
      type: row.type,
      image1: parseArray(row.image1),
      image1_title: row.image1_title,
      image1_des: row.image1_des,
      image2: parseArray(row.image2),
      image2_title: row.image2_title,
      image2_des: row.image2_des,
      title: row.title,
      des: row.des,
      sort_order: row.sort_order,
      status: row.status,
    }));

 
    const service = {
      ...serviceData,
      image: parseArray(serviceData.image),
      video: parseArray(serviceData.video),
      map_items,
    };

    res.render("details", {
      service,
      footer,
      addressList: addressRows,
    });

  } catch (error) {
    console.error("Error in getalldetails:", error.message);
    res.status(500).render("error", { message: error.message });
  }
};



module.exports = {
  getAllindustry,
  getalldetails
};
