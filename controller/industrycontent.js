const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

const getallservicecontent = async (req, res) => {
  try {
    const data = await connection.query(
      "select * from service_content where status >=0"
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

const getbyidservicecontent = async (req, res) => {
  try {
    const { sc_id } = req.params;
    if (!sc_id) {
      return res.status(400).json({
        status: false,
        message: "sc_id is required",
      });
    }
    const [rows] = await connection.query(
      `SELECT
         sc.*,
         scm.type, scm.image1, scm.image1_title, scm.image1_des,
         scm.image2, scm.image2_title, scm.image2_des, scm.title AS map_title,
         scm.des AS map_des, scm.sort_order AS map_sort_order, scm.status AS map_status
       FROM service_content sc
       LEFT JOIN service_content_map scm ON sc.sc_id = scm.sc_id
       WHERE sc.sc_id = ?`,
      [sc_id]
    );
    if (!rows.length) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    // Enhanced parseArray function to handle nested JSON arrays for display
    const parseArray = (val) => {
      if (!val) return [];
      
      // If it's already an array, check if it contains nested stringified arrays
      if (Array.isArray(val)) {
        // If it's an array with one string element that looks like JSON, try to parse it
        if (val.length === 1 && typeof val[0] === 'string') {
          try {
            const parsed = JSON.parse(val[0]);
            if (Array.isArray(parsed)) {
              // Recursively call parseArray to handle deeper nesting
              return parseArray(parsed);
            }
          } catch {
            // If parsing fails, return the original array
          }
        }
        return val;
      }
      
      // If it's a string, try to parse it
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          // Recursively call parseArray to handle nested arrays
          return parseArray(parsed);
        } catch {
          // If parsing fails, it's a regular string
          return [val];
        }
      }
      
      return [val];
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
      layout: serviceRow.layout,
      title: serviceRow.title,
      des: serviceRow.des,
      meta_title: serviceRow.meta_title,
      meta_des: serviceRow.meta_des,
      image: parseArray(serviceRow.image),
      video: parseArray(serviceRow.video),
      map_items: []
    };

    rows.forEach((row) => {
      if (row.map_title || row.type) {
        formattedService.map_items.push({
          type: row.type,
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
      title,
      des,
      video,
      meta_title,
      meta_des,
      map_items
    } = req.body;
    
    // Enhanced array handling to fix nested JSON arrays
    const ensureArray = (data) => {
      if (!data || data === null || data === undefined) return [];
      
      // If it's already an array, check if it contains nested stringified arrays
      if (Array.isArray(data)) {
        // If it's an array with one string element that looks like JSON, try to parse it
        if (data.length === 1 && typeof data[0] === 'string') {
          try {
            const parsed = JSON.parse(data[0]);
            if (Array.isArray(parsed)) {
              // Recursively call ensureArray to handle deeper nesting
              return ensureArray(parsed);
            }
          } catch {
            // If parsing fails, return the original array
          }
        }
        return data;
      }
      
      // If it's a string, try to parse it
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          // Recursively call ensureArray to handle nested arrays
          return ensureArray(parsed);
        } catch {
          // If parsing fails, it's a regular string
          return [data];
        }
      }
      
      return [data];
    };
    
    const imageJSON = JSON.stringify(ensureArray(image));
    const videoJSON = JSON.stringify(ensureArray(video));
    
    const [result] = await connection.query(
      `INSERT INTO service_content
      (parent_id, sub_title, tagline, slug, status, sort_order, ip,
       image, title, des, video, meta_title, meta_des)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id || 0,
        sub_title || "",
        tagline || "",
        slug || "",
        status || 1,
        sort_order || 0,
        clientIP,
        imageJSON,
        title || "",
        des || "",
        videoJSON,
        meta_title || "",
        meta_des || ""
      ]
    );

    const insertedScId = result.insertId;

    if (Array.isArray(map_items) && map_items.length > 0) {
      const mapValues = map_items.map(item => [
        insertedScId,
        item.type || "text-image",
        JSON.stringify(ensureArray(item.image1)),
        item.image1_title || "",
        item.image1_des || "",
        JSON.stringify(ensureArray(item.image2)),
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
         (sc_id, type, image1, image1_title, image1_des,
          image2, image2_title, image2_des, title, des,
          sort_order, status, ip)
         VALUES ?`,
        [mapValues]
      );
    }

    return res.status(201).json({
      status: true,
      message: "Service content and map data inserted successfully",
      sc_id: insertedScId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
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
      image, title, des, slug, status,
      sort_order, parent_id, sub_title,
      tagline, video,
      meta_title, meta_des,
      map_items
    } = req.body;
    
    // Enhanced array handling to fix nested JSON arrays
    const ensureArray = (data) => {
      if (!data || data === null || data === undefined) return [];
      
      // If it's already an array, check if it contains nested stringified arrays
      if (Array.isArray(data)) {
        // If it's an array with one string element that looks like JSON, try to parse it
        if (data.length === 1 && typeof data[0] === 'string') {
          try {
            const parsed = JSON.parse(data[0]);
            if (Array.isArray(parsed)) {
              // Recursively call ensureArray to handle deeper nesting
              return ensureArray(parsed);
            }
          } catch {
            // If parsing fails, return the original array
          }
        }
        return data;
      }
      
      // If it's a string, try to parse it
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          // Recursively call ensureArray to handle nested arrays
          return ensureArray(parsed);
        } catch {
          // If parsing fails, it's a regular string
          return [data];
        }
      }
      
      return [data];
    };
    
    const imageJSON = JSON.stringify(ensureArray(image));
    const videoJSON = JSON.stringify(ensureArray(video));
    
    const [updateRes] = await connection.query(
      `UPDATE service_content
       SET image=?, title=?, des=?, slug=?, status=?, sort_order=?, ip=?,
           parent_id=?, sub_title=?, tagline=?, video=?, meta_title=?, meta_des=?
       WHERE sc_id=?`,
      [
        imageJSON, title, des, slug, status, sort_order,
        clientIP, parent_id, sub_title, tagline,
        videoJSON, meta_title, meta_des, sc_id
      ]
    );

    await connection.query(
      `DELETE FROM service_content_map WHERE sc_id = ?`,
      [sc_id]
    );

    if (Array.isArray(map_items) && map_items.length > 0) {
      const mapValues = map_items.map(item => [
        sc_id,
        item.type || "text-image",
        JSON.stringify(ensureArray(item.image1)),
        item.image1_title || "",
        item.image1_des || "",
        JSON.stringify(ensureArray(item.image2)),
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
         (sc_id, type, image1, image1_title, image1_des,
          image2, image2_title, image2_des,
          title, des, sort_order, status, ip)
         VALUES ?`,
        [mapValues]
      );
    }

    return res.json({
      status: updateRes.changedRows > 0,
      message: updateRes.changedRows
        ? "Service content & map updated successfully"
        : "No changes made (or invalid sc_id)",
      sc_id,
      ip: clientIP
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

const updateservicecontentorder = async (req, res) => {
  try {
    const { scm_id, sc_id, sort_order } = req.body;
    const clientIP = getIP(req);

    if (scm_id) {
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

const addservicecontentmap = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { sc_id, image, title, des, type = "image1" } = req.body;

    if (!sc_id) {
      return res.status(400).json({
        status: false,
        message: "sc_id is required"
      });
    }

    // Enhanced array handling to fix nested JSON arrays
    const ensureArray = (data) => {
      if (!data || data === null || data === undefined) return [];
      
      // If it's already an array, check if it contains nested stringified arrays
      if (Array.isArray(data)) {
        // If it's an array with one string element that looks like JSON, try to parse it
        if (data.length === 1 && typeof data[0] === 'string') {
          try {
            const parsed = JSON.parse(data[0]);
            if (Array.isArray(parsed)) {
              // Recursively call ensureArray to handle deeper nesting
              return ensureArray(parsed);
            }
          } catch {
            // If parsing fails, return the original array
          }
        }
        return data;
      }
      
      // If it's a string, try to parse it
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          // Recursively call ensureArray to handle nested arrays
          return ensureArray(parsed);
        } catch {
          // If parsing fails, it's a regular string
          return [data];
        }
      }
      
      return [data];
    };

    const imageJSON = JSON.stringify(ensureArray(image));

    const [result] = await connection.query(
      `INSERT INTO service_content_map
       (sc_id, type, image1, image1_title, image1_des, sort_order, status, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sc_id, type, imageJSON, title || "", des || "", 0, 1, clientIP]
    );

    return res.status(201).json({
      status: true,
      message: "Service content map item added successfully",
      map_id: result.insertId
    });
  } catch (error) {
    console.error("Add service content map error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
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
  addservicecontentmap,
};