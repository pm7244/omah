const connection = require("../../connection");



const getAllBlog = async (req, res) => {

    try {
        const [web_blog] = await connection.query(`select * from web_blog where status=1`);
        const [blog] = await connection.query(`select * from blog where status=1`);
        const [blogCategory] = await connection.query(`select * from blog_category where cat_status=1`)


        if (blog.length > 0 || web_blog.length >0 || blogCategory.length>0) {
            res.status(200).json({
                web_blog: web_blog,
                blog: blog,
                blogCategory:blogCategory
            })
        } else {
            res.status(404).json({
                message: "Record Not Found"
            })
        }

    } catch (error) {

        res.status(500).json({
            message : error.message
        })

    }

}

const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({
                message: "Slug is required"
            });
        }

        const [data] = await connection.query(`SELECT * FROM blog WHERE blog_slug = ?`, [slug]);


        res.status(200).json({data: data});
       
    } catch (error) {
        return res.status(500).json({               
            error: error.message,
        });
    }
};



module.exports ={
    getAllBlog,getBlogBySlug
}