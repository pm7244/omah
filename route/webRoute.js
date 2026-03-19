const express = require("express");
const webRouter = express.Router();

const home = require("../controller/web_controller/home.js");
// const slider = require("../controller/web_controller/slider.js");
const about = require("../controller/web_controller/about.js");
// const blog = require("../controller/web_controller/blog.js");
// const career = require("../controller/web_controller/career.js");
const contact = require("../controller/web_controller/contact.js");
// const projects = require("../controller/web_controller/projects.js");
// const faq = require("../controller/web_controller/faqs.js");

// const search = require("../controller/web_controller/search.js");

const service = require("../controller/web_controller/service.js"); 
const project = require("../controller/web_controller/project.js");
const details = require("../controller/web_controller/industry.js");  
const privacyPolicy = require("../controller/web_controller/privacy_policy.js");
const team = require("../controller/web_controller/team.js");
const venue = require("../controller/web_controller/venue.js");
// const footers = require("../controller/web_controller/footer.js");




/*webRouter.get("/", (req, res) => {
  res.json({ status: true, message: "Hello" });
});*/
webRouter.get("/", home.getAllHome);
webRouter.get("/about", about.getAllAbout);
webRouter.get("/service", service.getAllservice);
webRouter.get("/service_details/:slug",service.getAllserviceslug)


webRouter.get("/project", project.getAllproject);
webRouter.get("/team", team.getAllTeam);

// webRouter.get("/footer", footers.getallfooter);
webRouter.get("/contact", contact.getAllContact);
webRouter.get("/venue", venue.getAllvenue);
webRouter.get("/privacy-policy", privacyPolicy.getPrivacyPolicy);



webRouter.get("/details/:slug", service.getalldetails);






module.exports = webRouter;
