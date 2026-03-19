const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallbuyer = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from buyer_guide where status >=0"
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

const getbyidbuyer = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    if (!buyer_id) {
      res.status(400).json({
        status: flase,
        message: "ID not present",
      });
    }
    const data = await connection.query(
      "select * from buyer_guide where buyer_id = ?",
      [buyer_id]
    );
    if (data[0][0]?.buyer_id) {
      return res.json({
        status: true,
        data: data[0],
      });
    } else {
      return res.json({
        status: false,
        message: "Id not present",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const createbuyer = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { title, question, breadcumb_name, answer, cover_image, status } =
      req.body;
    const data = await connection.query(
      "INSERT INTO buyer_guide (title	,question,	breadcumb_name,	answer,	cover_image,	status, ip) VALUES (?, ?, ?, ?, ?,?,?)",
      [title, question, breadcumb_name, answer, cover_image, status, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const updatebyidbuyer = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { buyer_id } = req.params;
    if (!buyer_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { title, question, breadcumb_name, answer, cover_image, status } =
      req.body;

    const data = await connection.query(
      "update buyer_guide set title=?,question=?,breadcumb_name=?,answer=?,cover_image=?,status=?,ip=? where buyer_id=?",
      [
        title,
        question,
        breadcumb_name,
        answer,
        cover_image,
        status,
        clientIP,
        buyer_id,
      ]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        data: data[0],
        ip: clientIP,
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

const deletebyidbuyer = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    if (!buyer_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }
    const data = await connection.query(
      "UPDATE buyer_guide SET status=-1 WHERE buyer_id=?",
      [buyer_id]
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

const updatebybuyeridstatus = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    if (!buyer_id) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const { status } = req.body;

    const data = await connection.query(
      "update buyer_guide set status=? where buyer_id=?",
      [status, buyer_id]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        message: "data upadte successfully",
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
  getallbuyer,
  getbyidbuyer,
  createbuyer,
  updatebyidbuyer,
  deletebyidbuyer,
  updatebybuyeridstatus,
};
