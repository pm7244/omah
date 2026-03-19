const connection = require("../../connection");


const getAllProjectCategory = async (req, res) => {

    try {
        const [project_category] = await connection.query(`select * from project_category where cat_status=1`);

        if (project_category.length > 0) {
            res.status(200).json({
                project_category: project_category
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

module.exports = { getAllProjectCategory }