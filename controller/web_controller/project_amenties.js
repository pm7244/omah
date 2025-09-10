const connection = require("../../connection");


const getAllProjectAmenities = async (req, res) => {

    try {
        const [project_amenities] = await connection.query(`select * from project_amenities `);

        if (project_amenities.length > 0) {
            res.status(200).json({
                project_amenities: project_amenities
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

module.exports = { getAllProjectAmenities }