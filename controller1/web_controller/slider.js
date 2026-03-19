const connection = require("../../connection");


const getAllSlider = async (req, res) => {

    try {
        const [slider] = await connection.query(`select * from web_slider where status=1`);

        if (slider.length > 0) {
            res.status(200).json({
                slider: slider
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

module.exports = { getAllSlider }