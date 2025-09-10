const connection = require("../../connection");



const getAllFaqs = async(req,res)=>{
    try {
        const [faqs] = await connection.query("select * from web_faqs where status=1");

        if(faqs.length>0){
            res.status(200).json({
                faqs: faqs
            })
        }else{
            res.status(404).json({
                message:"Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message :error.message
        })
        
    }

}

module.exports={
    getAllFaqs
}