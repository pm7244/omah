
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const path = require("path");


const router = require("./route/route");
const web_route = require("./route/web_route");
const client = require("./src/routes/web")


app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/images")));
app.use("/fonts", express.static(path.join(__dirname + "public/fonts")));
app.use(express.static(path.join(__dirname, "dist")));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname,"upload")));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/", client);
app.use("/api", router);
app.use("/web-api", web_route);

app.use("/cms", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "cms.html"));
});


//const PORT = process.env.PORT || 3001;
//app.listen(PORT || 5000, () => {
//  console.log("server is running on " + PORT);
//});
module.exports = app
