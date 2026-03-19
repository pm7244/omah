const connection = require("../../connection");

const getAllvenue = async (req, res) => {
  try {
    // const [aboutRows]   = await connection.query(
    //   "SELECT * FROM web_about WHERE status = 1"
    // );

    // const [contentRows] = await connection.query(
    //   "SELECT * FROM about_content WHERE status = 1 ORDER BY sort_order ASC"
    // );

    const [footerRows]  = await connection.query(
      "SELECT * FROM web_footer WHERE status = 1"
    );

    const [addressRows] = await connection.query(
      "SELECT * FROM address WHERE status = 1"
    );


   const [serviceContentMap] = await connection.query(
  "SELECT title FROM service_content WHERE status = 1 ORDER BY sort_order ASC"
);

    const footer = footerRows.length > 0 ? footerRows[0] : null;

    const getFirst = (str) => {
      try {
        return JSON.parse(str || "[]")[0] || "";
      } catch {
        return "";
      }
    };

    if (footer && footer.footer_logo) {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo);
      } catch {
        footer.footer_logo = [];
      }
    }

    // const content = contentRows.map(row => ({
    //   ...row,
    //   image: getFirst(row.image),
    //   bgImage: getFirst(row.bg_image),
    // }));


    res.render("venue", {
    //   about,
    //   content,
      footer,
      addressList: addressRows,
    serviceContentMap
    });

  } catch (err) {
    console.error(err);
    res.status(500).render("500", { message: err.message });
  }
};

module.exports = { getAllvenue };
