const connection = require("../../connection");

const getAllContact = async (req, res) => {
  try {
   
    const [contacts] = await connection.query("SELECT * FROM web_contact WHERE status = 1");
    const [addressData] = await connection.query("SELECT * FROM address WHERE status = 1");
    const [footerRows] = await connection.query("SELECT * FROM web_footer WHERE status = 1");
    const footer = footerRows.length > 0 ? footerRows[0] : null;

      const [serviceContentMap] = await connection.query(
  "SELECT title FROM service_content WHERE status = 1 ORDER BY sort_order ASC"
);


    if (footer && typeof footer.footer_logo === "string") {
      try {
        footer.footer_logo = JSON.parse(footer.footer_logo || "[]");
      } catch {
        footer.footer_logo = [];
      }
    }

 
    const contact = contacts.length > 0 ? contacts[0] : null;
    if (contact && typeof contact.video === "string") {
      try {
        contact.video = JSON.parse(contact.video || "[]");
      } catch {
        contact.video = [];
      }
    }

    
    res.render("contact", {
      contact,
      footer,
      addressList: addressData  ,
      serviceContentMap,
    });

  } catch (error) {
    console.error("Error fetching contact, footer, or address data:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllContact,
};
