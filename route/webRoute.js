const express = require("express");
const webRouter = express.Router();

const home = require("../controller/web_controller/home.js");
const slider = require("../controller/web_controller/slider.js");
const about = require("../controller/web_controller/about.js");
const blog = require("../controller/web_controller/blog.js");
const career = require("../controller/web_controller/career.js");
const contact = require("../controller/web_controller/contact.js");
const projects = require("../controller/web_controller/projects.js");
const faq = require("../controller/web_controller/faqs.js");
const footer = require("../controller/web_controller/footer.js");
const search = require("../controller/web_controller/search.js");

//Web Api Routes
webRouter.get("/", (req, res) => {
  res.json({ status: true, message: "Hello" });
});

webRouter.get("/web-home", home.getAllHome);
webRouter.get("/web-slider", slider.getAllSlider);
webRouter.get("/web-home", home.getAllHome);
webRouter.get("/web-slider", slider.getAllSlider);
webRouter.get("/web-about", about.getAllAbout);
webRouter.get("/web-blog", blog.getAllBlog);
webRouter.get("/web-career", career.getAllCareer);
webRouter.get("/web-contact", contact.getAllContact);
webRouter.get("/web-faqs", faq.getAllFaqs);
webRouter.get("/web-footer", footer.getAllFooter);
webRouter.get("/web-projects", projects.getAllProjects);
webRouter.get("/web-blog/:slug", blog.getBlogBySlug);
webRouter.post("/search", search.searchProjectsDetails);

module.exports = webRouter;
