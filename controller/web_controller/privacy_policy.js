const connection = require("../../connection");

const getPrivacyPolicy = async (req, res) => {
  try {
    const [footerRows]  = await connection.query("SELECT * FROM web_footer WHERE status = 1");
    const [addressRows] = await connection.query("SELECT * FROM address WHERE status = 1");

    const footer = footerRows.length > 0 ? footerRows[0] : null;

    if (footer && footer.footer_logo) {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo);
      } catch {
        footer.footer_logo = [];
      }
    }

    res.render("privacy-policy", {
      footer,
      addressList: addressRows  
    });

  } catch (err) {
    console.error(err);
    res.status(500).render("500", { message: err.message });
  }
};

module.exports = {
  getPrivacyPolicy
};
