const connection = require("../../connection");


const searchProjectsDetails = async (req, res) => {
    try {
        const { category, location } = req.query;

        let query = `
          SELECT p.*, pc.cat_title AS category, pl.name AS location
          FROM projects p
          JOIN project_category pc ON p.cat_id = pc.cat_id
          JOIN project_location pl ON p.pl_id = pl.pl_id
          WHERE 1=1 AND p.status=1`;

        const params = [];

        if (category) {
            query += ' AND pc.cat_id = ?';
            params.push(category);
        }

        if (location) {
            query += ' AND pl.name = ?';
            params.push(location);
        }

        const [results] = await connection.query(query, params);

        if (results) {
            res.status(200).json({
                result: results
            });
        } else {
            res.status(404).json({
                message: "Search Data Not Found"
            })
        }

    } catch (err) {
        console.error('error executing query:', err);
        res.status(500).json({ error: 'Database query error' });
    }
}

module.exports = {
    searchProjectsDetails
}