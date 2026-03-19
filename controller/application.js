const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallapplicant = async (req, res) => {
    try {
        const data = await connection.query(
            "SELECT  * from application where status >=0 "
        );
        if (data[0].length > 0) {
            res.status(200).json({
                status: true,
                data: data[0],
                message: "data fetch successfull",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "data not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};


const getbyidapplicant = async (req, res) => {
    try {
        const { applicant_id } = req.params;

        if (!applicant_id) {
            return res.status(404).json({
                status: false,
                message: "ID not found",
            });
        }

        const data = await connection.query(
            "SELECT * FROM application WHERE applicant_id = ?",
            [applicant_id]
        );

        const result = data[0];

        if (result.length > 0) {
            return res.status(200).json({
                status: true,
                data: result[0],
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Application not found",
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};


const createapplicant = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      image, title, a_slug, des, tagline,
      banner_img, breadcrumb, details_img, details_title,
      details_des, brochure, getintouch_des,
      meta_title, meta_des, status
    } = req.body;

    const [data] = await connection.query(
      `INSERT INTO application 
      (image, title, a_slug, des, tagline, banner_img, breadcrumb, details_img, details_title, details_des, brochure, getintouch_des, meta_title, meta_des, status, ip) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image, title, a_slug, des, tagline,
        banner_img, breadcrumb, details_img, details_title,
        details_des, brochure, getintouch_des,
        meta_title, meta_des, status, clientIP
      ]
    );

    res.status(200).json({
      status: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};




const updatebyidapplicant = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { applicant_id } = req.params;

    if (!applicant_id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      image, title, a_slug, des, tagline,
      banner_img, breadcrumb, details_img, details_title,
      details_des, brochure, getintouch_des,
      meta_title, meta_des, status
    } = req.body;

    const [data] = await connection.query(
      `UPDATE application 
       SET image=?, title=?, a_slug=?, des=?, tagline=?, 
           banner_img=?, breadcrumb=?, details_img=?, details_title=?, details_des=?, 
           brochure=?, getintouch_des=?, meta_title=?, meta_des=?, status=?, ip=? 
       WHERE applicant_id=?`,
      [
        image, title, a_slug, des, tagline,
        banner_img, breadcrumb, details_img, details_title,
        details_des, brochure, getintouch_des,
        meta_title, meta_des, status, clientIP,
        applicant_id
      ]
    );

    if (data.changedRows) {
      res.status(200).json({
        status: true,
        message: "Data updated successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No data changed or invalid ID",
      });
    }

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const updatebyidapplicantstatus = async (req, res) => {
    try {
        const { applicant_id } = req.params;
        if (!applicant_id) {
            res.status(404).json({
                status: false,
                message: "id not found",
            });
        }
        const { status } = req.body;
        const data = await connection.query(
            "UPDATE application SET status=? where applicant_id=?",
            [status, applicant_id]
        );
        if (data[0].changedRows) {
            res.status(404).json({
                status: true,
                message: "status update successfully",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "status not update",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

const deletebyidapplicant = async (req, res) => {
    try {
        const { applicant_id } = req.params;

        if (!applicant_id) {
            return res.status(400).json({
                status: false,
                message: "Id not present",
            });
        }
        const data = await connection.query(
            "UPDATE application SET status=-1 WHERE applicant_id=?",
            [applicant_id]
        );


        if (data[0].affectedRows == 1) {
            return res.status(200).json({
                status: true,
                message: "deleted successfully",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Failed to delete",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

module.exports = {
    getallapplicant,
    getbyidapplicant,
    createapplicant,
    updatebyidapplicant,
    updatebyidapplicantstatus,
    deletebyidapplicant,
};
