 const { getIp } = require("../clientIP");

const getAllfrp = async (req, res) => {
  try {
    res.render("whyfrp");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllfrp,
}; 
