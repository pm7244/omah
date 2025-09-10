const connection = require("../connection");
const { getIP } = require("../controller/clientIP");

// GET ALL
const getAllProject = async (req, res) => {
  try {
    const data = await connection.query(
      "SELECT * FROM project WHERE status >= 0"
    );

    if (data[0].length > 0) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No records found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


const getByIdProject = async (req, res) => {
  try {
    const { p_id } = req.params;
    if (!p_id) {
      return res.status(400).json({
        status: false,
        message: "ID not provided",
      });
    }

    const data = await connection.query(
      "SELECT * FROM project WHERE p_id = ? AND status >= 0",
      [p_id]
    );

    if (data[0][0]) {
      return res.status(200).json({
        status: true,
        data: data[0],
      });
    } else {
      return res.status(404).json({
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





// const createProject = async (req, res) => {
//   try {
//     const clientIP = getIP(req);
//     const {
//       pc_id,
//       image,
//         name,
//       slug,
//       image_name,
//       img_tagline,
//       video,
//       v_title,
//       v_des,
//       listing_image,
//       img_title,
//       img_des,
//       status,
//     } = req.body;

   

//    const data = await connection.query(
//   `INSERT INTO project 
//   (pc_id, image, name, slug, image_name, img_tagline, video, v_title, v_des, listing_image, img_title, img_des, status, ip) 
//   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//   [
//     pc_id,
//     image,
//     name,
//     slug,
//     image_name,
//     img_tagline,
//     video,
//     v_title,
//     v_des,
//     listing_image,
//     img_title,
//     img_des,
//     status,
//     clientIP,
//   ]
// );


//     res.status(200).json({
//       status: true,
//       message: "Project created successfully",
//       data: data[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       error: error.message,
//     });
//   }
// };

const createProject = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const {
      pc_id, 
      image,
      name,
      slug,
      image_name,
      img_tagline,
      video,
      v_title,
      v_des,
      listing_image,
      img_title,
      img_des,
      status,
    } = req.body;

    const pcIdString = Array.isArray(pc_id) ? pc_id.join(",") : pc_id;


    const [projectResult] = await connection.query(
      `INSERT INTO project 
      (pc_id, image, name, slug, image_name, img_tagline, video, v_title, v_des, listing_image, img_title, img_des, status, ip) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        pcIdString,
        image,
        name,
        slug,
        image_name,
        img_tagline,
        video,
        v_title,
        v_des,
        listing_image,
        img_title,
        img_des,
        status,
        clientIP,
      ]
    );

    const p_id = projectResult.insertId;


    if (Array.isArray(pc_id)) {
      for (const singlePcId of pc_id) {
        await connection.query(
          `INSERT INTO project_industry_map 
          (p_id, pc_id, ip, status) 
          VALUES (?, ?, ?,?)`,
          [p_id, singlePcId, clientIP, status]
        );
      }
    }


    res.status(200).json({
      status: true,
      message: "Project and industry mappings created successfully",
      project_id: p_id,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};





// const updatebyidproject = async (req, res) => {
//   try {
//     const clientIP = getIP(req);

//     const { 	p_id  } = req.params;
//     if (!	p_id ) {
//       return res.status(404).json({
//         status: false,
//         message: "Project id not found",
//       });
//     }

//     const {
//       pc_id,
//       name,
//       slug,
//       image,
//       image_name,
//       img_tagline,
//       video,
//       v_title,
//       v_des,
//       listing_image,
//       img_title,
//       img_des,
//       status,
//     } = req.body;

//     const pcIdStr = Array.isArray(pc_id) ? pc_id.join(",") : pc_id;



//     const data = await connection.query(
//       `UPDATE project SET 
//         pc_id = ?, 
//         name=?,
//         slug=?,
//         image = ?, 
//         image_name = ?, 
//         img_tagline = ?, 
//         video = ?, 
//         v_title = ?, 
//         v_des = ?, 
//         listing_image = ?, 
//         img_title = ?, 
//         img_des = ?, 
//         status = ?, 
//         ip = ?
//       WHERE p_id  = ?`,
//       [
//         pcIdStr,
//         image,
//         name ,
//         slug ,
//         image_name,
//         img_tagline,
//         video,
//         v_title,
//         v_des,
//         listing_image,
//         img_title,
//         img_des,
//         status,
//         clientIP,
//         	p_id ,
//       ]
//     );

//     if (data[0].changedRows) {
//       return res.status(200).json({
//         status: true,
//         message: "Project updated successfully",
//         ip: clientIP,
//       });
//     } else {
//       return res.status(404).json({
//         status: false,
//         message: "No changes made or invalid Project id",
//         ip: clientIP,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// const updatebyidproject = async (req, res) => {
//   try {
//     const clientIP = getIP(req);
//     const { p_id } = req.params;

//     if (!p_id) {
//       return res.status(404).json({
//         status: false,
//         message: "Project ID not found",
//       });
//     }

//     const {
//       pc_id,
//       name,
//       slug,
//       image,
//       image_name,
//       img_tagline,
//       video,
//       v_title,
//       v_des,
//       listing_image,
//       img_title,
//       img_des,
//       status,
//     } = req.body;

//     const pcIdStr = Array.isArray(pc_id) ? pc_id.join(",") : pc_id;
//     const newPcIds = Array.isArray(pc_id)
//       ? pc_id.map(Number)
//       : pcIdStr.split(",").map(Number);

//     await connection.query(
//       `UPDATE project SET 
//         pc_id = ?, 
//         name = ?, 
//         slug = ?, 
//         image = ?, 
//         image_name = ?, 
//         img_tagline = ?, 
//         video = ?, 
//         v_title = ?, 
//         v_des = ?, 
//         listing_image = ?, 
//         img_title = ?, 
//         img_des = ?, 
//         status = ?, 
//         ip = ?
//       WHERE p_id = ?`,
//       [
//         pcIdStr,
//         name,
//         slug,
//         image,
//         image_name,
//         img_tagline,
//         video,
//         v_title,
//         v_des,
//         listing_image,
//         img_title,
//         img_des,
//         status,
//         clientIP,
//         p_id,
//       ]
//     );

//     await connection.query(
//       `DELETE FROM project_industry_map 
//        WHERE p_id = ? AND pc_id NOT IN (${newPcIds.map(() => '?').join(',')})`,
//       [p_id, ...newPcIds]
//     );


//     for (const singlePcId of newPcIds) {
//       const [existing] = await connection.query(
//         `SELECT pcm_id FROM project_industry_map WHERE p_id = ? AND pc_id = ?`,
//         [p_id, singlePcId]
//       );

//       if (existing.length) {
//         await connection.query(
//           `UPDATE project_industry_map 
//            SET ip = ?, status = ?, updated_at = NOW() 
//            WHERE p_id = ? AND pc_id = ?`,
//           [clientIP, status, p_id, singlePcId]
//         );
//       } else {
//         await connection.query(
//           `INSERT INTO project_industry_map 
//            (p_id, pc_id, ip, status, created_at, updated_at) 
//            VALUES (?, ?, ?, ?, NOW(), NOW())`,
//           [p_id, singlePcId, clientIP, status]
//         );
//       }
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Project and industry mappings updated successfully",
//       project_id: p_id,
//       ip: clientIP,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

const updatebyidproject = async (req, res) => {
  try {
    const clientIP = getIP(req);
    const { p_id } = req.params;

    if (!p_id) {
      return res.status(404).json({
        status: false,
        message: "Project ID not found",
      });
    }

    const {
      pc_id,
      name,
      slug,
      image,
      image_name,
      img_tagline,
      video,
      v_title,
      v_des,
      listing_image,
      img_title,
      img_des,
      status,
    } = req.body;

    // Normalize pc_id into a clean array of numbers
    const pcIdStr =
      typeof pc_id === "string"
        ? pc_id
        : Array.isArray(pc_id)
        ? pc_id.join(",")
        : "";

    const newPcIds = pcIdStr
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    // Update project table
    await connection.query(
      `UPDATE project SET 
        pc_id = ?, 
        name = ?, 
        slug = ?, 
        image = ?, 
        image_name = ?, 
        img_tagline = ?, 
        video = ?, 
        v_title = ?, 
        v_des = ?, 
        listing_image = ?, 
        img_title = ?, 
        img_des = ?, 
        status = ?, 
        ip = ?
      WHERE p_id = ?`,
      [
        pcIdStr,
        name,
        slug,
        image,
        image_name,
        img_tagline,
        video,
        v_title,
        v_des,
        listing_image,
        img_title,
        img_des,
        status,
        clientIP,
        p_id,
      ]
    );

    // Remove mappings that are no longer selected
    if (newPcIds.length > 0) {
      await connection.query(
        `DELETE FROM project_industry_map 
         WHERE p_id = ? AND pc_id NOT IN (${newPcIds.map(() => "?").join(",")})`,
        [p_id, ...newPcIds]
      );
    } else {
      // If no categories selected, remove all
      await connection.query(
        `DELETE FROM project_industry_map WHERE p_id = ?`,
        [p_id]
      );
    }

    // Insert or update mapping entries
    for (const singlePcId of newPcIds) {
      const [existing] = await connection.query(
        `SELECT pcm_id FROM project_industry_map WHERE p_id = ? AND pc_id = ?`,
        [p_id, singlePcId]
      );

      if (existing.length) {
        await connection.query(
          `UPDATE project_industry_map 
           SET ip = ?, status = ?, updated_at = NOW() 
           WHERE p_id = ? AND pc_id = ?`,
          [clientIP, status, p_id, singlePcId]
        );
      } else {
        await connection.query(
          `INSERT INTO project_industry_map 
           (p_id, pc_id, ip, status, created_at, updated_at) 
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [p_id, singlePcId, clientIP, status]
        );
      }
    }

    return res.status(200).json({
      status: true,
      message: "Project and industry mappings updated successfully",
      project_id: p_id,
      ip: clientIP,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { p_id } = req.params;
    const data = await connection.query(
      "UPDATE project SET status = -1 WHERE p_id = ?",
      [p_id]
    );

    if (data[0].affectedRows) {
      return res.json({
        status: true,
        message: "Deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Invalid ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllProject,
   getByIdProject,
createProject,
updatebyidproject,
deleteProject,
};
