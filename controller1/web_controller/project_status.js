const connection = require("../../connection");


const getAllProjectStatus = async (req, res) => {

    try {
        const [project_status] = await connection.query(`select * from project_status `);

        if (project_status.length > 0) {
            res.status(200).json({
                project_status: project_status
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

module.exports = { getAllProjectStatus }