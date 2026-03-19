const connection = require("../connection");
const { getIP } = require("./clientIP");

const getallfactfigures = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from facts_figure where status >=0"
    );

    if (data[0].length > 0) {
      res.status(200).json({
        status: true,
        data: data[0],
        message: "data fetch successfully.",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "record not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getbyidfactfigures = async (req, res) => {
  try {
    const { fact_figure_id } = req.params;
    if (!fact_figure_id) {
      res.status(404).json({
        status: false,
        meaase: "ID not found",
      });
    }

    const data = await connection.query(
      "select * from facts_figure where fact_figure_id = ?",
      [fact_figure_id]
    );
    if (data[0][0]?.fact_figure_id) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      return res.status(404).json({
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

const createfactfigure = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { title, icon, number, symbol, description, status, ip } = req.body;

    const data = await connection.query(
      "insert into facts_figure(title, icon, number, symbol, description, status,ip) values (?,?,?,?,?,?,?) ",
      [title, icon, number, symbol, description, status, clientIP]
    );

    res.status(200).json({
      status: true,
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

const updatebyidfactfigure = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { fact_figure_id } = req.params;

    if (!fact_figure_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const { title, icon, number, symbol, description, status } = req.body;
    const data = await connection.query(
      "UPDATE facts_figure SET title=?, icon=?, number=?, symbol=?, description=?, status=?,ip=? WHERE fact_figure_id=?",
      [
        title,
        icon,
        number,
        symbol,
        description,
        status,
        clientIP,
        fact_figure_id,
      ]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "data update successfully",
        ip: clientIP,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const deletebyidfactfigure = async (req, res) => {
  try {
    const { fact_figure_id } = req.params;
    if (!fact_figure_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const data = await connection.query(
      "UPDATE facts_figure SET status=-1 where fact_figure_id=?",
      [fact_figure_id]
    );

    if (data[0].affectedRows) {
      return res.status(200).json({
        status: true,
        message: "Deleted successfully",
      });
    } else if (data[0].affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Wrong ID",
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

const updatebyidfactfigurestatus = async (req, res) => {
  try {
    const { fact_figure_id } = req.params;

    if (!fact_figure_id) {
      return res.status(400).json({
        status: false,
        message: "Id not present",
      });
    }

    const { status } = req.body;
    const data = await connection.query(
      "UPDATE facts_figure SET status=? WHERE fact_figure_id=?",
      [status, fact_figure_id]
    );

    if (data[0].changedRows) {
      return res.status(200).json({
        status: true,
        message: "data update successfully",
      });
    } else if (data[0].affectedRows === 0) {
      res.status(500).json({
        status: false,
        message: "wrong id",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getallfactfigures,
  getbyidfactfigures,
  createfactfigure,
  updatebyidfactfigure,
  deletebyidfactfigure,
  updatebyidfactfigurestatus,
};
