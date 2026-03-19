const connection = require("../../connection");

const getAllTeam = async (req, res) => {
  try {
    const [teamRows]   = await connection.query("SELECT * FROM web_team WHERE status = 1");
        const [aboutRows]   = await connection.query("SELECT * FROM web_about WHERE status = 1");
        const [teamsRows]   = await connection.query("SELECT * FROM team WHERE status = 1");

    const [contentRows] = await connection.query("SELECT * FROM about_content WHERE status = 1 ORDER BY sort_order ASC");
    const [footerRows]  = await connection.query("SELECT * FROM web_footer WHERE status = 1");
    const [addressRows] = await connection.query("SELECT * FROM address WHERE status = 1");

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

    const content = contentRows.map(row => ({
      ...row,
      image: getFirst(row.image),
      bgImage: getFirst(row.bg_image),
    }));

const team = {
  ...teamRows[0],
  banner_img: getFirst(teamRows[0]?.banner_img),
    image: getFirst(teamRows[0]?.image), 

  slider1_img: (() => {
    try {
      return JSON.parse(teamRows[0]?.slider1_img || "[]"); 
    } catch {
      return [];
    }
  })(),
  slider2_img: (() => {
    try {
      return JSON.parse(teamRows[0]?.slider2_img || "[]");
    } catch {
      return [];
    }
  })(),
};


   const teams = teamsRows;


     const about = {
      ...aboutRows[0],
      hero_image: getFirst(aboutRows[0]?.hero_image),
    };
    res.render("team", {
      team,
      teams,
      about,
      content,
      footer,
      addressList: addressRows,
      serviceContentMap,  
    });

  } catch (err) {
    console.error(err);
    res.status(500).render("500", { message: err.message });
  }
};

module.exports = { getAllTeam };
