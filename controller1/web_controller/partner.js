 const { getIp } = require("../clientIP");

const getAllpartner = async (req, res) => {
  try {
    res.render("partner");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllpartner,
}; 
