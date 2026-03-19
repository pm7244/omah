const connection = require("../../connection");


const getAllProjectLocation = async (req, res) => {

    try {
        const [project_location] = await connection.query(`select * from project_location `);

        if (project_location.length > 0) {
            res.status(200).json({
                project_location: project_location
            });
        } else {
            res.status(500).json({
                message: "Record Not Found"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }


}

module.exports = { getAllProjectLocation }