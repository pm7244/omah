const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getalloptions = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT o.cat_id,o.name,o.value,o.cat_id,o.options_status,c.parent_id,c.title,c.meta_title,c.meta_description,c.slug,c.cat_status,c.ip FROM options o JOIN project_category c ON o.cat_id  = c.cat_id where options_status >= 0"
    );
    //     const data = await connection.query(" SELECT p.cat_id,p.title,p.meta_title,p.meta_description,p.description,p.slug,p.cover_url,p.over_view,p.cover_type,p.listing_image,p.specification,p.location_advantages,p.plans,p.gallery_images,p.short_des,p.brochure,p.status,   c.parent_id,c.title,c.meta_title,c.meta_description,c.slug,c.ip,c.cat_status FROM projects p JOIN project_category c ON p.cat_id = c.cat_id");
    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Record Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getbyidoptions = async (req, res) => {
  try {
    const { options_id } = req.params;
    if (!options_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const data = await connection.query(
      "SELECT * FROM options where options_id=?",
      [options_id]
    );
    if (data[0][0]?.options_id) {
      res.status(404).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed to find",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const createoptions = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { name, value, cat_id } = req.body;
    const data = await connection.query(
      "INSERT INTO options (name,value,cat_id,ip) values(?,?,?,?)",
      [name, value, cat_id, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      IP: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidoptions = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { options_id } = req.params;
    if (!options_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const { name, value, cat_id, options_status } = req.body;
    const data = await connection.query(
      "update options set name=?,value=?,cat_id=?,options_status=?,ip=? where options_id = ? ",
      [name, value, cat_id, options_status, clientIP, options_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        ip: clientIP,
        message: "data update successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "data not update",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidoptionsstatus = async (req, res) => {
  try {
    const { options_id } = req.params;

    if (!options_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const { options_status } = req.body;
    const data = await connection.query(
      "update options set options_status=? where options_id=?",
      [options_id, options_status]
    );
    if (data[0].changedRows) {
      res.status(200).json({
        status: false,
        message: "status update successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed to updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deletebyidoptions = async(req,res) => {
  try {
   const{options_id} = req.params
   if(!options_id){
       res.status(404).json({
           status:false,
           message:"id not found"
       })
   }
   const data = await connection.query("update options set options_status=-1  where options_id=?",[options_id]) 
   if(data[0].affectedRows){
       res.status(200).json({
           status:true,
           message:"data deleted successfully"
       })
   }else{ 
       res.status(404).json({
       status:false,
       message:error.message
   })
      
   }
  } catch (error) {
   res.status(500).json({
       status:false,
       message:error.message
   })
  }
}


module.exports = {
  getalloptions,
  getbyidoptions,
  createoptions,
  updatebyidoptions,
  updatebyidoptionsstatus,
  deletebyidoptions,
};
