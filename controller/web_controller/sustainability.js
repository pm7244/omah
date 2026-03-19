 const { getIp } = require("../clientIP");

const getAllsustainability = async (req, res) => {
  try {
    res.render("sustainability");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllsustainability,
}; 
