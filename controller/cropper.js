const path = require("path");
const sharp = require("sharp");

const cropperLogic = (req, res) => {
  const { filename } = req.params;
  const { width, height, x, y } = req.query;

  const imagePath = path.join(__dirname, "..", "upload", filename);
  console.log(imagePath);
  sharp(imagePath)
    .extract({
      left: parseInt(x),
      top: parseInt(y),
      width: parseInt(width),
      height: parseInt(height),
    })
    .toBuffer()
    .then((transformedBuffer) => {
      res.set("Content-Type", "image/jpeg");
      res.send(transformedBuffer);
    })
    .catch((error) => {
      console.error("Error transforming image:", error);
      res.status(500).send("Error transforming image.");
    });
};

module.exports = { cropperLogic };
