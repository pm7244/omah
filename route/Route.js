const express = require("express");
const router = express.Router();

const middleware = require("../middleware/auth.js");
const filemanager = require("../controller/filemanager.js");
const connection = require("../connection.js");
const cropperLogic = require("../controller/cropper.js");
const store_setting = require("../controller/store_setting.js");
const users = require("../controller/users.js");
const enquiries = require("../controller/enquiries.js");

const about = require("../controller/about.js");


const webabout = require("../controller/web_about.js");
const webfooter = require("../controller/web_footer.js");
const webcontact = require("../controller/web_contact.js");
// const pre_projects = require("../controller/preprojects.js");
const industryCategory = require("../controller/industrycontent.js");
const project_contain = require("../controller/project_contain.js")


const team = require("../controller/team.js");
const webteam = require("../controller/web_team.js");


const address = require("../controller/address.js");


const project = require("../controller/projects.js");

const Webproject_category = require("../controller/web_serviceCategory.js");
const home = require("../controller/home.js");
const contenthome = require("../controller/home_content.js");


//new_home
router.get("/getallhome",home.getallhome);
router.get("/getbyidhome/:id",home.getbyidhome);
router.post("/createhome",home.createhome);
router.put("/updatebyidhome/:id?",home.updatebyidhome);
router.put("/updatehome-status/:id",home.updatebyidhomestatus);
router.delete("/deletebyidhome/:id",home.deletebyidhome);



//new_home_content
router.get("/getallhomecontent",contenthome.getallcontenthome);
router.get("/getbyidhomecontent/:hc_id",contenthome.getbyidcontenthome);
router.post("/createhomecontent",contenthome.createcontenthome);
router.put("/updatebyidhomecontent/:hc_id?",contenthome.updatebyidcontenthome);
router.delete("/deletebyidhomecontent/:hc_id",contenthome. deletebyicontenthome);



//web_team
router.get("/getallwebteam",webteam.getallwebteam);
router.get("/getbyidwebteam/:t_id",webteam.getbyidwebteam);
router.post("/createwebteam",webteam.createwebteam);
router.put("/updatebyidwebteam/:t_id?",webteam.updatebyidwebteam);
router.put("/updatewebteam-status/:t_id",webteam.updatebyidwebteamstatus);
router.delete("/deletebyidwebteam/:t_id",webteam.deletebyidwebteam);

//team
router.get("/getallteam",team.getallteam);
router.get("/getbyidteam/:id",team.getbyidteam);
router.post("/createteam",team.createteam);
router.put("/updatebyidteam/:id?",team.updatebyidteam);
router.put("/updateteam-status/:id",team.updatebyidteamstatus);
router.delete("/deletebyidteam/:id",team.deletebyidteam);





//authentication
router.post("/register", middleware.register);
router.post("/login", middleware.login);
router.get("/logout", middleware.logout);


//web_home
router.get("/getallcontain", project_contain.getallprojectcontain);
router.get('/getbyid-contain/:pc_id',project_contain.getbyidcontain);

// router.get("getall-contain/:pc_id", project_contain.getbyidcontain);
router.post("/createcontain", project_contain.createProjectSection);
router.put('/updatecontain/:pc_id?', project_contain.updategetcontainById);
// router.put("/updatehome-status/:pc_id", home.updatebyidhomestatus);
router.delete("/deletebyidcontain/:pc_id", project_contain.deletebyidcontain);


//filemanager
router.get("/get-files/:directory(*)", filemanager.fetchAllFiles);
router.post("/create-directory/:directory(*)", filemanager.createDirectory);
router.post("/upload-file/:directory(*)", filemanager.uploadFile);
router.delete("/delete-directory/:directory(*)", filemanager.deleteDirectory);
router.delete("/delete-all/:directory(*)", filemanager.deleteAll);


//store_setting
router.get("/getallstore_setting", store_setting.getallstore_setting);
router.get("/getbyid-store_setting/:store_id",store_setting.getbyidstore_setting
);
router.post("/create-store_setting", store_setting.createstore_setting);
router.put("/update-store_setting/:store_id",store_setting.updatebyidstore_setting
);
router.put("/status-store_setting/:store_id",store_setting.updatebyidstore_settingstatus
);
router.delete("/delete-store_setting/:store_id",store_setting.deletebyidstore_setting
);

//users
router.get("/getallusers", users.getallusers);
router.get("/getbyidusers/:user_id", users.getbyidusers);
router.post("/createusers", users.createusers);
router.put("/updatebyidusers/:user_id?", users.updatebyidusers);
router.put("/updateuser-status/:user_id?", users.updatebyidassociateuserstatus);
router.put("/updatepassword/:user_id", users.updatepassword);
router.delete("/deletebyidusers/:user_id", users.deletebyidusers);



//about
router.get("/getall-about", about.getallaboutcontent);
router.get("/getbyid-about/:ac_id", about.getbyidaboutcontent);
router.post("/create-about", about.createaboutcontent);
router.put("/updatebyid-about/:ac_id?", about.updatebyidaboutcontent);
router.put("/update-about-status/:ac_id", about.updatebyidaboutstatuscontent);
router.delete("/deletebyid-about/:ac_id", about.deletebyidaboutcontent);


//web_about
router.get("/getallabout", webabout.getallabout);
router.get("/getbyidabout/:id", webabout.getbyidabout);
router.post("/createabout", webabout.createabout);
router.put("/updatebyidabout/:id?", webabout.updatebyidabout);
router.put("/updateabout-status/:id", webabout.updatebyidaboutstatus);
router.delete("/deletebyidabout/:id", webabout.deletebyidabout);

//web_about_content
router.get("/getallaboutcontent", about.getallaboutcontent);
router.get("/getbyidaboutcontent/:ac_id", about.getbyidaboutcontent);
router.post("/createaboutcontent", about.createaboutcontent);
router.put("/updatebyidaboutcontent/:ac_id?", about.updatebyidaboutcontent);
router.put("/updateaboutcontent-status/:ac_id", about.updatebyidaboutstatuscontent);
router.delete("/deletebyidaboutcontent/:ac_id", about.deletebyidaboutcontent);

//web_footer
router.get("/getallfooter", webfooter.getallwebfooter);
router.get("/getbyidfooter/:id", webfooter.getbyidwebfooter);
router.post("/createfooter", webfooter.createwebfooter);
router.put("/updatebyidfooter/:id?", webfooter.updatebyidwebfooter);
router.put("/updatefooter-status/:id", webfooter.updatebyidwebfooterstatus);
router.delete("/deletebyidfooter/:id", webfooter.deletebyidwebfooter);

//web_contact
router.get("/getallcontact", webcontact.getallwebcontact);
router.get("/getbyidcontact/:id", webcontact.getbyidwebcontact);
router.post("/createcontact", webcontact.createwebcontact);
router.put("/updatebyidcontact/:id?", webcontact.updatebyidwebcontact);
router.put("/updatecontact-status/:id", webcontact.updatebyidwebcontactstatus);
router.delete("/deletebyidcontact/:id", webcontact.deletebyidwebcontact);

//address
router.get("/getalladdress", address.getalladdress);
router.get("/getbyidaddress/:address_id", address.getbyidaddress);
router.post("/createaddress", address.createaddress);
router.put("/updatebyidaddress/:address_id?", address.updatebyidaddress);
router.put("/updateaddress-status/:address_id",address.updatebyidaddressstatus
);
router.delete("/deletebyidaddress/:address_id", address.deletebyidaddress);



//project
router.get("/getallproject", project.getAllProject);
router.get("/getbyidproject/:p_id", project.getByIdProject);
router.post("/createproject", project.createProject);
router.put("/updateproject/:p_id", project.updatebyidproject);
// router.put("/status/:p_id", project.updatebyidprojectstatus);
router.delete("/projectd/:p_id", project.deleteProject);
// router.post("/createspecification", project.createSpecification);
// router.put("/updatespecification/:id", project.updateSpecification);

//web_pre_projects
router.get("/getallwebpreprojects", Webproject_category.getallpreprojects);
router.put("/updatebyidwebpreprojects/:id?",Webproject_category.updatebyidpreprojects);


//enquiries
router.get("/getallenquiries", enquiries.getallEnquiry);

router.get("/getbyidenquiries/:enquiry_id", enquiries.getbyidenquiries);
router.post("/createenquiries", enquiries.createenquiries);
router.put("/updatebyidenquiries/:enquiry_id?", enquiries.updatebyidenquiries);
router.put("/updateenquiries-status/:enquiry_id?",enquiries.updatebyidenquirystatus);
router.delete("/deletebyidenquiries/:enquiry_id",enquiries.deletebyidenquiries);


//pre-projects
// router.get("/getallpreprojects", industryCategory.getallpreprojects);
// router.delete("/deletebyidpreprojects/:id",industryCategory.deletebyidpre_projects);
// router.post("/createpreprojects", industryCategory.createpreprojects);
// router.put("/updatebyidpreprojects/:id", industryCategory.updatebyidpreprojects);
// router.get("/getbyidpreprojects/:id", industryCategory.getbyidpreprojects);

// //pre-projects
// router.get("/getallpreprojects", pre_projects.getallpreprojects);
// router.delete("/deletebyidpreprojects/:id",pre_projects.deletebyidpre_projects);
// router.post("/createpreprojects", pre_projects.createpreprojects);
// router.put("/updatebyidpreprojects/:id", pre_projects.updatebyidpreprojects);
// router.get("/getbyidpreprojects/:id", pre_projects.getbyidpreprojects)




//image-cropper
router.get("/transform/:filename(*)", cropperLogic.cropperLogic);

//service_content routes for web-industry content management
router.get("/getallservicecontent", industryCategory.getallservicecontent);
router.get("/getbyidservicecontent/:sc_id", industryCategory.getbyidservicecontent);
router.post("/createservicecontent", industryCategory.createservicecontent);
router.put("/updatebyidservicecontent/:sc_id", industryCategory.updatebyidservicecontent);
router.delete("/deletebyidservicecontent/:sc_id", industryCategory.deletebyidservicecontent);
router.put("/updateservicecontentorder", industryCategory.updateservicecontentorder);








module.exports = router;
