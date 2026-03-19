const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallwhyfrp = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from whyfrp  where status >=0 "
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

const getbyidwhyfrp = async (req, res) => {
  try {
    const { f_id	 } = req.params;
    if (!f_id	) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "select * from whyfrp where f_id	 = ?",
      [f_id	]
    );
    if (data[0][0]?.f_id	) {
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

const createwhyfrp = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { title, f_slug, des, icon, status } = req.body;

    const data = await connection.query(
      "INSERT INTO whyfrp (title, f_slug, des, icon, status, ip) VALUES (?, ?, ?, ?, ?, ?)",
      [title, f_slug, des, icon, status, clientIP]
    );

    res.status(200).json({
      status: true,
      data: data[0],
      ip: clientIP,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};



const updatebyidwhyfrp = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const { f_id	 } = req.params;
    if (!f_id	) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const { name, link, logo, sort_order, status } = req.body;

    const data = await connection.query(
      "update whyfrp set name=?,link=?,logo=?,sort_order=?,status=?,ip=?  where f_id	=?",
      [name, link, logo, sort_order, status, clientIP, f_id	]
    );

    if (data[0].changedRows) {
      return res.json({
        status: true,
        data: data[0],
        ip: clientIP,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Nothing to update",
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const deletebyidwhyfrp = async (req, res) => {
  try {
    const { f_id	 } = req.params;
    if (!f_id	) {
      res.status(404).json({
        status: false,
        message: "ID not found",
      });
    }

    const data = await connection.query(
      "UPDATE whyfrp SET status=-1 WHERE f_id	=?",
      [f_id	]
    );

    if (data[0].affectedRows == 1) {
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

const updatebyidwhyfrpstatus = async (req, res) => {
  const { f_id	 } = req.params;
  if (!f_id	) {
    res.status(200).json({
      status: false,
      message: "ID not found",
    });
  }
  const { status } = req.body;
  const data = await connection.query(
    "UPDATE whyfrp set status=? where f_id	 = ?",
    [status, f_id	]
  );
  if (data[0].changedRows) {
    res.status(200).json({
      status: true,
      message: "UPDATE data successsfully",
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
  getallwhyfrp,
  getbyidwhyfrp,
  createwhyfrp,
  updatebyidwhyfrp,
  deletebyidwhyfrp,
  updatebyidwhyfrpstatus,
};
