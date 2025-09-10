const connection = require("../../connection");


const getAllContact = async (req, res) => {
    try {
        const [contact] = await connection.query("select * from web_contact where status=1");
        const [address]= await connection.query("select * from address where status=1");

        if (contact.length > 0 || address.length >0) {

            res.status(200).json({
                contact: contact,
                address :address
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

module.exports ={
    getAllContact
}