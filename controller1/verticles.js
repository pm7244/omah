const connection = require("../connection");
const { getIP } = require("../controller/clientIP");




const getallverticles = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from verticles where status >=0 "
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

const getbyidverticles = async (req, res) => {
  try {
    const { v_id } = req.params;
    if (!v_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "select * from verticles where v_id= ? ",
      [v_id]
    );
    if (data[0][0]?.v_id) {
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

const createverticles = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { v_title, v_des, v_slug,v_image, status } = req.body;

    const data = await connection.query(
      "INSERT INTO verticles (v_title, v_des, v_slug,v_image, status, ip) VALUES (?,?, ?, ?, ?, ?)",
      [v_title, v_des, v_slug,v_image, status, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const updatebyidverticles = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { v_id } = req.params;

    if (!v_id) {
      return res.status(400).json({
        status: false,
        message: "ID not provided",
      });
    }

    const { v_title, v_des, v_slug,v_image, status } = req.body;

    const data = await connection.query(
      `UPDATE verticles 
       SET v_title = ?, v_des = ?, v_slug = ?,v_image=?, status = ?, ip = ? 
       WHERE v_id = ?`,
      [v_title, v_des, v_slug,v_image, status, clientIP, v_id]
    );

    if (data[0].changedRows) {
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


const deletebyidverticles = async (req, res) => {
  try {
      const { v_id } = req.params
      if (!v_id) {
          res.status(404).json({
              status: false,
              meaase: "ID not found"
          })
      }

      const data = await connection.query(
          "UPDATE verticles SET status=-1 WHERE v_id=?",
          [v_id]
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

const updatebyidverticlesstatus = async (req, res) => {
  const { v_id } = req.params;
  if (!v_id) {
    res.status(404)({
      status: false,
      message: "IP not found",
    });
  }
  const { status } = req.body;
  const data = await connection.query(
    "UPDATE verticles SET status=? where v_id = ?",
    [status, v_id]
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
  getallverticles,
  getbyidverticles,
  createverticles,
  updatebyidverticles,
  deletebyidverticles,
  updatebyidverticlesstatus,
};
