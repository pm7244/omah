const connection = require("../../connection");

const {getIp} = require("../clientIP")

const getAllAbout = async(req,res)=>{
    try {
        const [about] = await connection.query(`SELECT * from web_about where status=1 `);
        const [management] =await connection.query(`SELECT * FROM management where status=1`);
        const [awards] = await connection.query(`select * from awards where status=1`);
        const [associate] = await connection.query(`SELECT * FROM associate where status=1`);


        if(about.length>0 || management.length>0 || awards.length>0){
            res.status(200).json({
                about: about,
                management:management,
                awards:awards,
                associate:associate,

            })
        }else{
            res.status(404).json({
                message : "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
        
    }
   
}

module.exports={
    getAllAbout
}