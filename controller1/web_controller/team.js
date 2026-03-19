 const { getIp } = require("../clientIP");

const getAllteam = async (req, res) => {
  try {

    const [team] = await connection.query(`select * from team where status=1`);
    res.render("team");
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllteam,
}; 
