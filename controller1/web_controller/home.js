const connection = require("../../connection");

const getAllHome = async (req, res) => {
  try {
    // Fetch data
    const [homeRows] = await connection.query("SELECT * FROM home WHERE status = 1");
    const [contentRows] = await connection.query(
      "SELECT * FROM home_content WHERE status = 1 ORDER BY CAST(sort_order AS UNSIGNED) ASC"
    );
    const [addressRows] = await connection.query("SELECT * FROM address WHERE status = 1");
    const [footerRows] = await connection.query("SELECT * FROM web_footer WHERE status = 1");
    const [serviceContentMapRows] = await connection.query(
      "SELECT * FROM service_content WHERE parent_id = 0 AND status = 1 ORDER BY CAST(sort_order AS UNSIGNED) ASC"
    );

     const [AboutcontentRowsRaw ] = await connection.query("SELECT * FROM about_content WHERE status = 1 ORDER BY sort_order ASC");

     const [parentRows] = await connection.query(
      "SELECT * FROM service_content WHERE sc_id = 1 AND status = 1"
    );
    const parent = parentRows[0] || null;



    // Footer parse
    const footer = footerRows.length > 0 ? footerRows[0] : null;
    if (footer && footer.footer_logo) {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo);
      } catch {
        footer.footer_logo = [];
      }
    }

    // Content image parsing
    const content = contentRows.map(row => {
      const getFirst = str => {
        try {
          return JSON.parse(str || "[]")[0] || "";
        } catch {
          return "";
        }
      };
      return {
        ...row,
        image1Url: getFirst(row.image1),
        image2Url: getFirst(row.image_2),
      };
    });

  const AboutcontentRows = AboutcontentRowsRaw.map(row => {
      let image = "";
      try {
        const arr = JSON.parse(row.image || "[]");
        image = arr[0] || "";
      } catch {
        image = "";
      }

      return {
        ...row,
        image
      };
    });



    // Service Content Map image parsing
    const serviceContentMap = serviceContentMapRows.map(row => {
      let image = "";
      try {
        const arr = JSON.parse(row.image || "[]");
        image = arr[0] || "";
      } catch {
        image = "";
      }

         let card_images = "";
      try {
        const arr = JSON.parse(row.card_images || "[]");
        card_images = arr[0] || "";
      } catch {
        card_images = "";
      }


      return { ...row, image , card_images};
    });

    // Render home page
    res.render("home", {
      home: homeRows[0] || null,
      content,
      addressList: addressRows,
      footer,
      AboutcontentRows,
      serviceContentMap,
      parent 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500", { message: err.message });
  }
};

module.exports = { getAllHome };
