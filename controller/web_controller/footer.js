const connection = require("../../connection");


const getAllFooter = async(req,res) => {
    try {
        const [footer] = await connection.query(`select * from web_footer where status=1`);
        const [address] = await connection.query(`select * from address where status=1`);
        const [store_setting] = await connection.query(`select * from store_setting where status=1`);
        const [s_link] = await connection.query(`select * from social_links where status=1`);


        if(footer.length>0 || address.length>0){
            res.status(200).json({
                footer : footer,
                address : address,
                store_setting:store_setting,
                s_link : s_link
            })
        }else{
            res.staus(404).json({
                message: "Record Not Found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
        
    }
}

module.exports={
   getAllFooter

}