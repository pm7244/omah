const connection = require("../../connection");



const getAllCareer = async (req, res) => {
    try {
        
        const [career] = await connection.query(`select * from web_career where status=1`)

        if (career.length > 0) {
            res.status(200).json({
                career: career
            })
        } else {
            res.status(404).json({
                message: "Record Not Found"
            })
        }
    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}

module.exports = {
    getAllCareer
}