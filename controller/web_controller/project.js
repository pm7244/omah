const connection = require("../../connection");

const {getIp} = require("../clientIP")

const getAllproject = async(req,res) =>{
    try {
   
    //   console.log("Controller home");

         res.render('project');


    } catch (error) {
        res.status(500).json({
            error : error.message
        })
        
    }

}

module.exports={
    getAllproject
}