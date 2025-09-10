const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const router = require("./route/Route");
const webRouter = require("./route/webRoute");
const path = require("path");

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.static(path.join(__dirname, "cms")));
app.use("/", webRouter);
app.use("/api", router);
app.use("/cms/*", (req, res) => {
  res.sendFile(path.join(__dirname, "cms", "cms.html"));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT || 5000, () => {
  console.log("server is running on " + PORT);
});
