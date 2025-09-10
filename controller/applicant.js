
const connection = require("../connection");
const { getIP } = require("../controller/clientIP");
const multer = require('multer');

const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload/resume')); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' +req.body.name+'-'+ Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage }).single('resume');


const createapplicant = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ status: false, error: 'Failed to upload resume' });
      }

      const clientIP = getIP(req);
      const { job_id, name, email, phone_no, city, position, message, applicant_status } = req.body;
      const orgPath = req.file ? req.file.path : null;
      let path = '/var/www/nodejs/www/fortune/upload/';
      const resumePath = orgPath.replace(path,'')


      if (!name || !email || !phone_no || !city || !resumePath || !message) {
        return res.status(400).json({
          status: false,
          error: 'All fields are required, including resume file'
        });
      }

      try {
        const data = await connection.query(
          "INSERT INTO applicant (job_id, name, email, phone_no, city, message, resume, position, applicant_status, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [job_id, name, email, phone_no, city, message, resumePath, position, applicant_status, clientIP]
        );

        res.status(200).json({ status: true, message: "Thanks! Your form has been accepted." });

      } catch (dbError) {
        console.error('Database insertion error:', dbError);
        res.status(500).json({ status: false, error: 'Database insertion error' });
      }
    });
  } catch (error) {
    console.error('Error in createapplicant:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};



const getallapplicant = async (req, res) => {
  
  try {
    const data = await connection.query(
      "select a.applicant_id,a.name,a.job_id,j.title,j.experience,j.location,j.status,j.ip,a.email,a.phone_no,a.city,a.message,a.resume,a.position,a.applicant_status,a.ip from applicant a JOIN job_positions j ON a.job_id=j.job_id where applicant_status >= 0  "
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

const getbyidapplicant = async (req, res) => {
  try {
    const { applicant_id } = req.params;

    if (!applicant_id) {
      return res.status(404).json({
        status: false,
        message: " ID not found",
      });
    }

    const data = await connection.query(
      "select * from applicant where 	applicant_id = ? ",
      [applicant_id]
    );
    if (data[0][0]?.applicant_id) {
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

const updatebyidapplicant = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { applicant_id } = req.params;
    if (!applicant_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const {
      name,
      email,
      phone_no,
      city,
      message,
      resume,
      position,
      ip,
      applicant_status,
    } = req.body;
    const data = await connection.query(
      "update applicant set name=?, email=?, phone_no=?, city=?,message=?, resume=?, position=?,ip=?, applicant_status=? where applicant_id=?",
      [
        name,
        email,
        phone_no,
        city,
        message,
        resume,
        position,
        applicant_status,
        clientIP,
        applicant_id,
      ]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        data: data[0],
        ip: clientIP,
      });
    } else {
      res.status(404),
        json({
          status: false,
          message: "update to failed",
        });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      messageL: error.message,
    });
  }
};

const deletebyidapplicant = async (req, res) => {
  try {
    const { applicant_id } = req.params;
    if (!applicant_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "UPDATE applicant SET applicant_status=-1 WHERE applicant_id=?",
      [applicant_id]
    );
    if (data[0].affectedRows==1) {
      res.status(200).json({
        status: true,
        message: "daleted sucessfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed is deleted",
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
        message: "ID not found",
      });
    }

    const { applicant_status } = req.body;

    const data = await connection.query(
      "update applicant set applicant_status=? where applicant_id=?",
      [applicant_status, applicant_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "status updated successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
module.exports = {
  getallapplicant,
  getbyidapplicant,
  createapplicant,
  updatebyidapplicant,
  deletebyidapplicant,
  updatebyidapplicantstatus,
};
