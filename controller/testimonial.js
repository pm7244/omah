const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getalltestimonial = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from testimonials where status >=0"
    );
    if (data && data[0].length > 0) {
      return res.status(200).json({
        message: "get all post",
        status: true,
        data: data[0],
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
      message: error.message,
    });
  }
};

const getbyidtestimonial = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    if (!testimonial_id) {
      res.status(404).json({
        status: false,
        message: "id not found",
      });
    }
    const data = await connection.query(
      "select * from testimonials where testimonial_id = ?",
      [testimonial_id]
    );
    if (data[0][0]?.testimonial_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      res.status(404).json({
        staus: false,
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const createtestimonial = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { title, post, des,image, status } = req.body;

    const data = await connection.query(
      `INSERT INTO testimonials (title, post, des,image, status, ip) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, post, des,image, status, clientIP]
    );

    res.status(200).json({
      status: true,
      message: "Testimonial created successfully",
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const updatebyidtestimonial = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { testimonial_id } = req.params;

    if (!testimonial_id) {
      return res.status(400).json({
        status: false,
        message: "testimonial_id is required",
      });
    }

    const { title, post, des,image, status } = req.body;

    const data = await connection.query(
      `UPDATE testimonials 
       SET title = ?, post = ?, des = ?, image=?,status = ?, ip = ?, updated_at = NOW() 
       WHERE testimonial_id = ?`,
      [title, post, des,image, status, clientIP, testimonial_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "Testimonial updated successfully",
        ip: clientIP,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No changes made or testimonial not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const deletebyidtestimonial = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    if (!testimonial_id) {
      return res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const data = await connection.query(
      " update testimonials set status=-1 where testimonial_id = ?",
      [testimonial_id]
    );
    if (data[0].affectedRows) {
      res.status(200).json({
        status: true,
        message: "Deleted successfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed to delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updatebyidenquirytestimonialstatus = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    if (!testimonial_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }
    const { status } = req.body;
    const data = await connection.query(
      "UPDATE testimonials set status=? where testimonial_id = ? ",
      [status, testimonial_id]
    );
    if (data[0].changedRows) {
      res.status(200).json({
        status: true,
        message: "data update sucessfully",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed to update",
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
  getalltestimonial,
  getbyidtestimonial,
  createtestimonial,
  updatebyidtestimonial,
  deletebyidtestimonial,
  updatebyidenquirytestimonialstatus,
};
