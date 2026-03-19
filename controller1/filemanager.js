const fs = require("fs").promises;
const fsp = fs;
const path = require("path");
const multer = require("multer");

// const fetchAllFiles = (req, res) => {
//   const directory = req.params.directory || "";
//   const PublicDirectory = path.join(__dirname, "..", "upload", directory);

//   try {
//     fs.stat(PublicDirectory, (err, stats) => {
//       if (err || !stats.isDirectory()) {
//         return res.status(404).json({
//           message: "Directory not found",
//           status: "error",
//         });
//       }

//       fs.readdir(PublicDirectory, (err, items) => {
//         if (err) {
//           return res.status(500).json({
//             message: "Error retrieving files",
//             error: err.message,
//           });
//         }

//         const data = [];
//         if (items.length === 0) {
//           return res.status(200).json({
//             message: "Empty Folder",
//             status: "success",
//             path: directory,
//             data: data,
//           });
//         }

//         items.forEach((item) => {
//           const uploadDirectory = path.join(__dirname, "../");
//           const absolute = path.join(PublicDirectory, item);
//           const itemPath = absolute.substring(uploadDirectory.length);
//           fs.stat(absolute, (err, stats) => {
//             if (err) {
//               return res.status(500).json({
//                 message: "Error retrieving file stats",
//                 status: "error",
//                 error: err.message,
//               });
//             }

//             const sanitizedPath = itemPath.replace(/\\/g, "/");

//             if (stats.isDirectory()) {
//               data.push({
//                 type: "directory",
//                 name: item,
//                 path: sanitizedPath,
//               });
//             } else {
//               data.push({
//                 type: "file",
//                 name: item,
//                 path: sanitizedPath,
//                 extension: path.extname(item),
//               });
//             }
//             if (data.length === items.length) {
//               return res.status(200).json({
//                 message: "Files retrieved successfully",
//                 status: "success",
//                 path: directory,
//                 data: data,
//               });
//             }
//           });
//         });
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// const createDirectory = (req, res) => {
//   const directory = req.params.directory;
//   const PublicDirectory = path.join("upload", directory);

//   const folder = req.body.folderName;
//   const folderPath = PublicDirectory + "/" + folder;

//   try {
//     fs.access(folderPath, (error) => {
//       if (error) {
//         fs.mkdir(folderPath, { recursive: true }, (error) => {
//           if (error) {
//             console.log(error);
//             return res.status(404).json({
//               status: false,
//               message: error.message,
//             });
//           } else {
//             console.log("New Directory created successfully !!");
//             return res.status(200).json({
//               status: true,
//               message: "New Directory created successfully !!",
//             });
//           }
//         });
//       } else {
//         console.log("Given Directory already exists !!");
//         return res.status(404).json({
//           status: false,
//           message: "Given Directory already exists !!",
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

const fetchAllFiles = async (req, res) => {
  const directory = req.params.directory || "";
  const PublicDirectory = path.join(__dirname, "..", "upload", directory);

  try {
    const stats = await fsp.stat(PublicDirectory);
    if (!stats.isDirectory()) {
      return res.status(404).json({
        message: "Directory not found",
        status: "error",
      });
    }

    const items = await fsp.readdir(PublicDirectory);
    if (items.length === 0) {
      return res.status(200).json({
        message: "Empty Folder",
        status: "success",
        path: directory,
        data: [],
      });
    }

    const data = await Promise.all(
      items.map(async (item) => {
        const uploadDirectory = path.join(__dirname, "../");
        const absolute = path.join(PublicDirectory, item);
        const itemPath = absolute.substring(uploadDirectory.length);
        const sanitizedPath = itemPath.replace(/\\/g, "/");

        const itemStats = await fsp.stat(absolute);
        if (itemStats.isDirectory()) {
          return {
            type: "directory",
            name: item,
            path: sanitizedPath,
          };
        } else {
          return {
            type: "file",
            name: item,
            path: sanitizedPath,
            extension: path.extname(item),
          };
        }
      })
    );

    return res.status(200).json({
      message: "Files retrieved successfully",
      status: "success",
      path: directory,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

const createDirectory = async (req, res) => {
  const directory = req.params.directory;
  const PublicDirectory = path.join(__dirname, "..", "upload", directory);

  console.log(path, path.dirname, __dirname);

  const folder = req.body.folderName;
  const folderPath = PublicDirectory + "/" + folder;

  console.log(directory, folder, folderPath, PublicDirectory);

  try {
    // Check if the directory exists
    await fs.access(folderPath);
    // Directory exists
    return res.status(400).json({
      status: false,
      message: "Given Directory already exists!",
    });
  } catch (error) {
    // Directory does not exist, attempt to create it
    try {
      await fs.mkdir(folderPath, { recursive: true });
      console.log("New Directory created successfully!", folderPath);
      return res.status(200).json({
        status: true,
        message: "New Directory created successfully!",
      });
    } catch (mkdirError) {
      console.error(mkdirError);
      return res.status(500).json({
        status: false,
        message: mkdirError.message,
      });
    }
  }
};

const uploadFile = (req, res) => {
  const directory = req.params.directory || "";
  const PublicDirectory = path.join(__dirname, "..", "upload", directory);

  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, PublicDirectory);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage }).single("fileName");

    upload(req, res, function (err) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Error uploading file",
          error: err,
        });
      }

      return res.status(200).json({
        status: true,
        fileDetail: req.file,
        message: "File uploaded successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// const deleteDirectory = (req, res) => {
//   const directory = req.params.directory || "";
//   const PublicDirectory = path.join("upload", directory);

//   try {
//     if (fs.existsSync(PublicDirectory)) {
//       if (fs.lstatSync(PublicDirectory).isFile()) {
//         fs.rm(PublicDirectory, (err) => {
//           if (err) {
//             return res.status(404).json({
//               message: "File not found",
//               status: "error",
//             });
//           } else {
//             return res.status(200).json({
//               message: "File deleted successfully",
//               status: "success",
//             });
//           }
//         });
//       } else if (fs.lstatSync(PublicDirectory).isDirectory()) {
//         fs.rm(PublicDirectory, { recursive: true });
//         return res.status(200).json({
//           message: "Folder deleted successfully",
//           status: "success",
//         });
//       } else {
//         res.status(404).json({
//           message: "Given path not found",
//         });
//       }
//     }
//   } catch (error) {
//     res.status(404).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };
// const fs = require("fs");
// const path = require("path");

const deleteDirectory = async (req, res) => {
  const directory = req.params.directory || "";
  const PublicDirectory = path.join(__dirname, "..", "upload", directory);

  try {
    // Check if the path exists
    try {
      await fs.access(PublicDirectory);
    } catch {
      return res.status(404).json({
        message: "Path not found",
        status: "error",
      });
    }

    // Get stats of the path
    const stats = await fs.lstat(PublicDirectory);

    if (stats.isFile()) {
      // Delete file
      await fs.rm(PublicDirectory);
      return res.status(200).json({
        message: "File deleted successfully",
        status: "success",
      });
    }

    if (stats.isDirectory()) {
      // Delete directory recursively
      await fs.rm(PublicDirectory, { recursive: true });
      return res.status(200).json({
        message: "Folder deleted successfully",
        status: "success",
      });
    }

    // If the path is neither a file nor a folder
    return res.status(400).json({
      message: "Given path is neither a file nor a folder",
      status: "error",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting file or folder",
      status: "error",
      error: error.message,
    });
  }
};

const deleteAll = (req, res) => {
  const directory = req.params.directory || "";
  const PublicDirectory = path.join("upload", directory);

  try {
    // const items = [req.body.items];
    const items = Array.isArray(req.body.items)
      ? req.body.items
      : [req.body.items];
    const responses = [];

    items.forEach((item) => {
      const itemPath = PublicDirectory + "/" + item;

      if (fs.existsSync(itemPath)) {
        if (fs.lstatSync(itemPath).isFile()) {
          fs.rm(itemPath);
          responses.push({
            status: "success",
            message: "File deleted successfully",
          });
        } else if (fs.lstatSync(itemPath).isDirectory()) {
          fs.rm(itemPath, { recursive: true });
          responses.push({
            status: "success",
            message: "Directory deleted successfully",
          });
        }
      } else {
        responses.push({
          message: "Item not found",
        });
      }
    });

    return res.json({
      data: responses,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  fetchAllFiles,
  createDirectory,
  uploadFile,
  deleteDirectory,
  deleteAll,
};
