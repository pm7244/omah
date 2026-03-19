const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallservicecontent = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM service_content WHERE status >= 0 ORDER BY CAST(sort_order AS UNSIGNED) ASC"
    );

    if (rows.length > 0) {
      res.status(200).json({
        status: true,
        data: rows,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No records found",
      });
    }
  } catch (error) {
    console.error("Error in getAllServiceContent:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getbyidservicecontent = async (req, res) => {
  try {
    const { sc_id } = req.params;

    if (!sc_id) {
      return res.status(400).json({
        status: false,
        message: "sc_id is required"
      });
    }

    const [rows] = await connection.query(
      `SELECT
        sc.*,
        scm.type,
        scm.layout,
        scm.image1,
        scm.image1_title,
        scm.image1_des,
        scm.image2,
        scm.image2_title,
        scm.image2_des,
        scm.title AS map_title,
        scm.des AS map_des,
        scm.sort_order AS map_sort_order,
        scm.status AS map_status
      FROM service_content sc
      LEFT JOIN service_content_map scm ON sc.sc_id = scm.sc_id
      WHERE sc.sc_id = ?
      ORDER BY scm.sort_order ASC`,
      [sc_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: false,
        message: "Record not found"
      });
    }

    const parseArray = (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const serviceRow = rows[0];

    const formattedService = {
      sc_id: serviceRow.sc_id,
      parent_id: serviceRow.parent_id,
      sub_title: serviceRow.sub_title,
      tagline: serviceRow.tagline,
      slug: serviceRow.slug,
      status: serviceRow.status,
      sort_order: serviceRow.sort_order,
      title: serviceRow.title,
      des: serviceRow.des,
     banner_image: parseArray(serviceRow.banner_image),
      slider: parseArray(serviceRow.slider),
      meta_title: serviceRow.meta_title,
      meta_des: serviceRow.meta_des,
      image: parseArray(serviceRow.image),
      video: parseArray(serviceRow.video),
      map_items: []
    };

    rows.forEach(row => {
      if (row.map_title || row.type || row.layout) {
        formattedService.map_items.push({
          type: row.type,
          layout: row.layout,
          image1: parseArray(row.image1),
          image1_title: row.image1_title,
          image1_des: row.image1_des,
          image2: parseArray(row.image2),
          image2_title: row.image2_title,
          image2_des: row.image2_des,
          title: row.map_title,
          des: row.map_des,
          sort_order: row.map_sort_order,
          status: row.map_status
        });
      }
    });

    return res.status(200).json({
      status: true,
      data: formattedService
    });

  } catch (error) {
    console.error("Error in getbyidservicecontent:", error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};



const deletebyidservicecontent = async (req, res) => {
  try {
    const { sc_id } = req.params;
    if (!sc_id) {
      throw new Error("Id not present");
    }
    const data = await connection.query(
      "update service_content set status=-1 WHERE sc_id=?",
      [sc_id]
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
const createservicecontent = async (req, res) => {
  try {
    const clientIP = getIP(req);

    const {
      parent_id,
      sub_title,
      tagline,
      slug,
      status,
      sort_order,
      image,
      banner_image,
      slider,
      title,
      des,
      video,
      meta_title,
      meta_des,
      map_items
    } = req.body;

    const imageJSON = JSON.stringify(image || []);
    const bannerImageJSON = JSON.stringify(banner_image || []);
    const sliderJSON = JSON.stringify(slider || []);
    const videoJSON = JSON.stringify(video || []);

    const [result] = await connection.query(
      `INSERT INTO service_content
      (
        parent_id,
        sub_title,
        tagline,
        slug,
        status,
        sort_order,
        ip,
        image,
        banner_image,
        slider,
        title,
        des,
        video,
        meta_title,
        meta_des
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id || 0,
        sub_title || "",
        tagline || "",
        slug || "",
        status || 1,
        sort_order || 0,
        clientIP,
        imageJSON,
        bannerImageJSON,
        sliderJSON,
        title || "",
        des || "",
        videoJSON,
        meta_title || "",
        meta_des || ""
      ]
    );

    const sc_id = result.insertId;

    if (Array.isArray(map_items) && map_items.length > 0) {
      const mapValues = map_items.map(item => [
        sc_id,
        item.type || "text-image",
        item.layout || "text-image",
        JSON.stringify(item.image1 || []),
        item.image1_title || "",
        item.image1_des || "",
        JSON.stringify(item.image2 || []),
        item.image2_title || "",
        item.image2_des || "",
        item.title || "",
        item.des || "",
        item.sort_order || 0,
        item.status || 1,
        clientIP
      ]);

      await connection.query(
        `INSERT INTO service_content_map
        (
          sc_id,
          type,
          layout,
          image1,
          image1_title,
          image1_des,
          image2,
          image2_title,
          image2_des,
          title,
          des,
          sort_order,
          status,
          ip
        )
        VALUES ?`,
        [mapValues]
      );
    }

    return res.status(201).json({
      status: true,
      message: "Service content created successfully",
      sc_id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};



const updatebyidservicecontent = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { sc_id } = req.params;

    if (!sc_id) {
      return res.status(400).json({ status: false, message: "sc_id is required" });
    }

    const {
      image,
      banner_image,
      slider,
      title,
      des,
      slug,
      status,
      sort_order,
      parent_id,
      sub_title,
      tagline,
      video,
      meta_title,
      meta_des,
      map_items
    } = req.body;

    const imageJSON = JSON.stringify(image || []);
    const bannerImageJSON = JSON.stringify(banner_image || []);
    const sliderJSON = JSON.stringify(slider || []);
    const videoJSON = JSON.stringify(video || []);

    // 1️⃣ Update main service content
    await connection.query(
      `UPDATE service_content SET
        image=?, banner_image=?, slider=?, title=?, des=?, slug=?, status=?,
        sort_order=?, ip=?, parent_id=?, sub_title=?, tagline=?, video=?,
        meta_title=?, meta_des=?
       WHERE sc_id=?`,
      [
        imageJSON, bannerImageJSON, sliderJSON, title || "", des || "", slug || "",
        status ?? 1, sort_order ?? 0, clientIP, parent_id ?? 0, sub_title || "",
        tagline || "", videoJSON, meta_title || "", meta_des || "", sc_id
      ]
    );

    // 2️⃣ Delete all old map items for this sc_id
    await connection.query(
      `DELETE FROM service_content_map WHERE sc_id = ?`,
      [sc_id]
    );

    // 3️⃣ Insert new map items
    if (Array.isArray(map_items) && map_items.length > 0) {
      for (const item of map_items) {
        await connection.query(
          `INSERT INTO service_content_map
            (sc_id, type, layout, image1, image1_title, image1_des,
             image2, image2_title, image2_des, title, des,
             sort_order, status, ip)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            sc_id,
            item.type || "content",
            item.layout || "",
            JSON.stringify(item.image1 || []),
            item.image1_title || "",
            item.image1_des || "",
            JSON.stringify(item.image2 || []),
            item.image2_title || "",
            item.image2_des || "",
            item.title || "",
            item.des || "",
            item.sort_order || 0,
            item.status ?? 1,
            clientIP
          ]
        );
      }
    }

    return res.json({
      status: true,
 message: `Service content update successfully`,
      sc_id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};



const updateservicecontentorder = async (req, res) => {
  try {
    const { scm_id, sc_id, sort_order } = req.body;
    const clientIP = getIP(req);

    // Support both service content map ordering and main service ordering
    if (scm_id) {
      // Update service_content_map table
      if (sort_order === undefined) {
        return res.status(400).json({
          status: false,
          message: "scm_id and sort_order are required"
        });
      }

      const [result] = await connection.query(
        "UPDATE service_content_map SET sort_order = ?, ip = ? WHERE scm_id = ?",
        [sort_order, clientIP, scm_id]
      );

      if (result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Content order updated successfully"
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Content not found"
        });
      }
    } else if (sc_id) {
      // Update service_content table
      if (sort_order === undefined) {
        return res.status(400).json({
          status: false,
          message: "sc_id and sort_order are required"
        });
      }

      const [result] = await connection.query(
        "UPDATE service_content SET sort_order = ?, ip = ? WHERE sc_id = ?",
        [sort_order, clientIP, sc_id]
      );

      if (result.affectedRows > 0) {
        res.status(200).json({
          status: true,
          message: "Service order updated successfully"
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Service not found"
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "Either scm_id or sc_id is required"
      });
    }
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

module.exports = {
  getallservicecontent,
  deletebyidservicecontent,
  updatebyidservicecontent,
  createservicecontent,
  getbyidservicecontent,
  updateservicecontentorder,
};