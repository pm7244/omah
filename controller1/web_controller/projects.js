const connection = require("../../connection");


const getAllProjects = async(req,res)=>{
    try {
        const [projects] = await connection.query("select * from projects where status=1");
        

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

const getProjectsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({
                message: "Slug is required"
            });
        }

        const [data] = await connection.query(`SELECT * FROM projects WHERE slug = ?`, [slug]);


        res.status(200).json({data: data});
       
    } catch (error) {
        return res.status(500).json({               
            error: error.message,
        });
    }
};



module.exports={
    getAllProjects,getProjectsBySlug
}