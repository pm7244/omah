const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const session = require("express-session");
// const fileUpload = require('express-fileupload'); // Add this line

const { API_URL, API_IMG } = require("./config");
const router = require("./route/Route");
const webRouter = require("./route/webRoute");
const path = require("path");

// Set up the templating engine
app.set("view engine", "ejs");
console.log(path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "./views/"));

// Add file upload middleware
// app.use(fileUpload());

// Set up global variables
app.locals.API_URL = API_URL;
app.locals.API_IMG = API_IMG;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "upload")));
console.log(path.join(__dirname, "upload"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "cms")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Define routes
app.use("/cms/*", (req, res) => {
  res.sendFile(path.join(__dirname, "cms", "cms.html"));
});
app.use("/", webRouter);
app.use("/api", router);
// webRouter.get("/*", (req, res) => {
//   res.render("404");
// });

// Start the server
const PORT = null || 3002; 
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

module.exports = app;
