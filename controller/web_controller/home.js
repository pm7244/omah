const connection = require("../../connection");


const getAllHome = async(req,res) =>{
    try {

        const [home] = await connection.query(`SELECT * FROM web_home where status=1`);
        const [slider] = await connection.query(`SELECT * FROM web_slider where status=1`);
        const [project] = await connection.query(`SELECT * FROM projects where status=1`);
        const [testimonials] = await connection.query(`SELECT * FROM testimonials where status=1`);
        const [awards] = await connection.query(`SELECT * FROM  awards where status=1`);
        const [associate] = await connection.query(`SELECT * FROM associate where status=1`);
        const [factFigure] = await connection.query(`SELECT * FROM facts_figure where status=1`);

        if(home.length>0 || slider.length>0 || project.length>0 || testimonials.length>0 || awards.length>0 || associate.length>0){
            res.status(200).json({
                home:home,
                slider:slider,
                project:project,
                testimonials:testimonials,
                awards:awards,
                associate:associate,
                factFigure:factFigure
               
            })
        }else{
            res.status(404).json({
                message : "Record Not Found"
            })
        }

    } catch (error) {
        res.status(500).json({
            error : error.message
        })
        
    }

}
   

module.exports ={getAllHome}