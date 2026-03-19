const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallhome = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from home where status >= 0"
    );

    if (data && data[0].length > 0) {
      res.status(200).json({
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
      error: error.message,
    });
  }
};

const getbyidhome = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: "id not found",
      });
    }

    const data = await connection.query(
      "SELECT * FROM home WHERE id = ? AND status >= 0",
      [id]
    );
    if (data[0][0]?.id) {
      return res.json({
        status: true,
        data: data[0],
      });
    } else {
      return res.json({
        status: false,
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createhome = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      video,
      mission_slider,
      mission_title,
      mission_des,
      hero_image,
      heroimage_text,
      hero_title,
      hero_sub_title,
      hero_text,
      meta_title,
      meta_des,
      status
    } = req.body;



    const [data] = await connection.query(
      `INSERT INTO home (
        video,
      mission_slider,
      mission_title,
      mission_des,
      hero_image,
      heroimage_text,
        hero_title,
        hero_sub_title,
        hero_text,
        meta_title,
        meta_des,
        ip,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)`,
      [
        video,
        mission_slider,
        mission_title,
        mission_des,
        hero_image,
        heroimage_text,
        hero_title,
        hero_sub_title,
        hero_text,
        meta_title,
        meta_des,
        clientIP,
        status
      ]
    );

    res.status(200).json({
      status: true,
      data,
      ip: clientIP
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};


const updatebyidhome = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const {
      video,
      mission_slider,
      mission_title,
      mission_des,
      hero_image,
      heroimage_text,
      hero_title,
      hero_sub_title,
      hero_text,
      meta_title,
      meta_des,
      status
    } = req.body;


    const [data] = await connection.query(
      `UPDATE home SET 
        video = ?, 
         mission_slider = ?,
      mission_title = ?,
      mission_des = ?,
      hero_image = ?,
      heroimage_text=?,
        hero_title = ?, 
        hero_sub_title = ?, 
        hero_text = ?, 
        meta_title = ?, 
        meta_des = ?, 
        status = ?, 
        ip = ?
      WHERE id = ?`,
      [
        video,
        mission_slider,
        mission_title,
        mission_des,
        hero_image,
        heroimage_text,
        hero_title,
        hero_sub_title,
        hero_text,
        meta_title,
        meta_des,
        status,
        clientIP,
        id
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
      error: error.message,
    });
  }
};



const deletebyidhome = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "update  home set status=-1 WHERE id=?",
      [id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: " Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
      });
    } else {
      return res.json({
        status: false,
        message: "Failed to delete",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      error: error.message,
    });
  }
};

const updatebyidhomestatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update home set status=? where id=?",
      [status, id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "status updated successfully",
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
  getallhome,
  getbyidhome,
  createhome,
  updatebyidhome,
  deletebyidhome,
  updatebyidhomestatus,
};
