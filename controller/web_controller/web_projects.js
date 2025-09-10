const connection = require("../../connection");



const getAllProjects = async(req,res)=>{
    try {
        const [projects] = await connection.query("select * from web_projects where project_status=1");
        

        if(projects.length>0 ){
            res.status(200).json({
                projects:projects
            })
        }else{
            res.status(404).json({
                message:"Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        
    }
}

module.exports={
    getAllProjects
}