const connection = require("../connection");
const { getIP } = require("../controller/clientIP");




const getallwebverticles = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from web_verticals where status >=0 "
    );

    if (data && data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "get all post",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const getbyidwebverticles = async (req, res) => {
  try {
    const { id  } = req.params;
    if (!id ) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "select * from web_verticals where id = ? ",
      [id ]
    );
    if (data[0][0]?.id ) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      stattus: false,
      message: error.message,
    });
  }
};

const createwebverticles = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      name,
      short_des,
      logo,
      sort_order,
      slug,
      banner_image,
      breadcrumb,
      detail_img,
      detail_title,
      detail_des,
      offerings_title,
      offerings_des,
      Application,
      image,
      status,
      meta_title,
      meta_des,
      getintouch_des,
      why_vertical,
      brochure, // <-- added here
    } = req.body;

    const [data] = await connection.query(
      `INSERT INTO web_verticals 
      (name, short_des, logo, sort_order, slug, banner_image, breadcrumb, detail_img, detail_title, detail_des, offerings_title, offerings_des, Application, image, status, ip, meta_title, meta_des, getintouch_des, why_vertical, brochure)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        short_des,
        logo,
        sort_order,
        slug,
        banner_image,
        breadcrumb,
        detail_img,
        detail_title,
        detail_des,
        offerings_title,
        offerings_des,
        Application,
        image,
        status,
        clientIP,
        meta_title,
        meta_des,
        getintouch_des,
        why_vertical,
        brochure, // <-- added here
      ]
    );

    res.status(200).json({
      status: true,
      message: "Vertical created successfully",
      data: data,
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};



const updatebyidwebverticles = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "ID not provided",
      });
    }

    const {
      name,
      short_des,
      logo,
      sort_order,
      slug,
      banner_image,
      breadcrumb,
      detail_img,
      detail_title,
      detail_des,
      offerings_title,
      offerings_des,
      Application,
      image,
      status,
      meta_title,
      meta_des,
      getintouch_des,
      why_vertical,
      brochure,  
    } = req.body;

    const [data] = await connection.query(
      `UPDATE web_verticals SET 
        name = ?, short_des = ?, logo = ?, sort_order = ?, slug = ?, banner_image = ?, breadcrumb = ?, 
        detail_img = ?, detail_title = ?, detail_des = ?, offerings_title = ?, offerings_des = ?, 
        Application = ?, image = ?, status = ?, ip = ?, meta_title = ?, meta_des = ?, getintouch_des = ?, 
        why_vertical = ?, brochure = ?
      WHERE id = ?`,
      [
        name,
        short_des,
        logo,
        sort_order,
        slug,
        banner_image,
        breadcrumb,
        detail_img,
        detail_title,
        detail_des,
        offerings_title,
        offerings_des,
        Application,
        image,
        status,
        clientIP,
        meta_title,
        meta_des,
        getintouch_des,
        why_vertical,
        brochure,  
        id,
      ]
    );

    if (data.changedRows) {
      return res.status(200).json({
        status: true,
        message: "Successfully updated",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};







const deletebyidwebverticles = async (req, res) => {
  try {
      const { id  } = req.params
      if (!id ) {
          res.status(404).json({
              status: false,
              meaase: "ID not found"
          })
      }

      const data = await connection.query(
          "UPDATE web_verticals SET status=-1 WHERE id =?",
          [id ]
      );

      if (data[0].affectedRows) {
          res.status(200).json({
              status: true,
              message: "daleted sucessfully"
          })
      } else if (data[0].affectedRows === 0) {
          return res.status(404).json({
              status: false,
              message: "Wrong ID"
          });
      } else {
          res.status(404).json({
              status: false,
              message: "failed is deleted"
          })
      }
  } catch (error) {
      res.status(500).json({
          status: false,
          message: error.message
      })
  }
}

const updatebyidwebverticlesstatus = async (req, res) => {
  const { id  } = req.params;
  if (!id ) {
    res.status(404)({
      status: false,
      message: "IP not found",
    });
  }
  const { status } = req.body;
  const data = await connection.query(
    "UPDATE web_verticals SET status=? where id  = ?",
    [status, id ]
  );
  if (data[0].changedRows) {
    res.status(200).json({
      status: true,
      message: " status updated successfully",
    });
  } else if (data[0].affectedRows === 0) {
    return res.status(404).json({
      status: false,
      message: "Wrong ID",
    });
  } else {
    res.status(404).json({
      status: false,
      message: "failed to update",
    });
  }
};

module.exports = {
  getallwebverticles,
  getbyidwebverticles,
  createwebverticles,
  updatebyidwebverticles,
  deletebyidwebverticles,
  updatebyidwebverticlesstatus,
};
