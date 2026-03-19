import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.scss";

//components
import Sales from "./component/dashboards/sales/sales";
import Error404 from "./component/Authentication/errorpage/error404/error404";

import App from "./layout/App";
import About from "./component/pagecomponent/about/about";
import Home from "./component/pagecomponent/home/home";
import Blog from "./component/pagecomponent/blog/Blog";
import Contact from "./component/pagecomponent/contacts/contacts";
import Career from "./component/pagecomponent/career/Career";
import Associates from "./component/pagecomponent/Common/Associates";
import Awards from "./component/pagecomponent/Common/Awards";
import Footer from "./component/pagecomponent/Common/Footer";
import Management from "./component/pagecomponent/Common/Management";
import SocialLinks from "./component/pagecomponent/Common/SocialLinks";
import AddSlider from "./component/pagecomponent/home/Slider";
import AssocLists from "./component/pagecomponent/Common/AssocLists";
import SocialEdit from "./component/pagecomponent/Common/SocialEdit";
import Filemanagermain from "./component/pagecomponent/fileManager/filemanagermain";
import ManagementList from "./component/pagecomponent/Common/ManagementList";
import SliderEdit from "./component/pagecomponent/home/SliderEdit";
import CreatorTeam from "./component/pagecomponent/Common/CreatorTeam";
import ProjectConfigs from "./component/Projects/ProjectConfigs";
import ProjectsCatEdits from "./component/Projects/ProjectsCatEdits";
import ProjectsAmenEdits from "./component/Projects/ProjectAmenEdits";
import ProjectsLocEdits from "./component/Projects/ProjectsLocEdits";
import ProjectsStatusEdits from "./component/Projects/ProjectsStatusEdits";
import Projects from "./component/Projects/Projects";
import ProjectEdit from "./component/Projects/ProjectEdit";
import ProjectCreate from "./component/Projects/ProjectCreate";
import StoreSetting from "./component/pagecomponent/store-setting/store-setting";
import Testimonials from "./component/pagecomponent/testimonals/testimonals";
import Addtestimonals from "./component/pagecomponent/testimonals/addtestimonals";
import EditTestimonals from "./component/pagecomponent/testimonals/edittestimonals";
import Enquiry from "./component/pagecomponent/enquiry/enquiry";
import FactsAndFig from "./component/pagecomponent/fact_n_fig/factsFig";
import AddFactAndFigure from "./component/pagecomponent/fact_n_fig/addFactFig";
import EditFactFig from "./component/pagecomponent/fact_n_fig/editfactfig";
import JobApplicant from "./component/pagecomponent/job-career/job_applicant";
import DCareer from "./component/pagecomponent/job-career/career";
import AddCareer from "./component/pagecomponent/job-career/addcareer";
import FaqEdit from "./component/pagecomponent/faq/FaqEdit";
import Blogs from "./component/pagecomponent/blog/blogs";
import BlogAdd from "./component/pagecomponent/blog/addblog";
import BlogEdit from "./component/pagecomponent/blog/editblog";
import BlogCategory from "./component/pagecomponent/blog/blogcategories";
import SignInCover1 from "./component/Authentication/signin/cover1/signincover1";
import { AuthProvider, useAuth } from "./layout/AuthContext";
import BuyersGuide from "./component/pagecomponent/BuyersGuide/BuyersGuide";
import BuyersAdd from "./component/pagecomponent/BuyersGuide/AddBuyers";
import BuyersEdit from "./component/pagecomponent/BuyersGuide/EditBuyers";

import WebTeam from "./component/pagecomponent/web_team/team.jsx"
import CreateTeam from "./component/pagecomponent/web_team/create.jsx"
import EditTeam from "./component/pagecomponent/web_team/edit.jsx"



import AddNewSpecification from "./component/Projects/AddNewSpecification";



import SubCategoryProject from "./component/pagecomponent/subCatAndproject/ProjectsCat"
import AddSubCategoryProject from "./component/pagecomponent/subCatAndproject/AddProjectsCat.jsx"
// import EditSubCategoryProject from "./component/pagecomponent/subCatAndproject/EditProjectsCatEdits"


// import subCategoryProject from "./component/pagecomponent/subCatAndproject/ProjectsCat";
// import AddSubCategoryProject from "./component/pagecomponent/subCatAndproject/AddProjectsCat";
// import EditFactFig from "./component/pagecomponent/subCatAndproject/EditProjectsCatEdits



import AboutApi from "./component/pagecomponent/about/about.jsx"
import AboutAdd from "./component/pagecomponent/about/addabout.jsx";
import AboutEdit from "./component/pagecomponent/about/editabout.jsx";


// common

import Addresses from "./component/pagecomponent/Common/Addresses";
import WebAbout from "./component/pagecomponent/Common/web_about.jsx";

import WebService from "./component/pagecomponent/WebService/WebService.jsx";
import ServiceCreate from "./component/pagecomponent/WebService/ServiceCreate.jsx";
import ServiceEdit from "./component/pagecomponent/WebService/ServiceEdit.jsx";
import PreProjects from "./component/PreProjects/PreProjects";
import EditPreProjects from "./component/PreProjects/EditPreProjects";
import AddPreProjects from "./component/PreProjects/AddPreProjects";
import ProfileManagement from "./component/pagecomponent/profile/ProfileManagement.jsx";
import ProfileSettings from "./component/pagecomponent/ProfileSettings/ProfileSettings.jsx";





// import FaqEdit from "./component/pagecomponent/faq/FaqEdit";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="login" />;
};

const router = createBrowserRouter([
  {
    path: "/cms/login",
    element: <SignInCover1 />,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms`,
    element: <App />,
    children: [
      { index: true, element: <Sales /> },
      {
        path: `projects`,
        children: [
          {
            path: `configs`,
            element: <ProjectConfigs />,
          },
          {
            path: `category-edit/:id`,
            element: <ProjectsCatEdits />,
          },
          {
            path: `amenities-edit/:id`,
            element: <ProjectsAmenEdits />,
          },
          {
            path: `location-edit/:id`,
            element: <ProjectsLocEdits />,
          },
          {
            path: `status-edit/:id`,
            element: <ProjectsStatusEdits />,
          },
          {
            path: `project-edit/:id`,
            element: <ProjectEdit />,
          },
          {
            path: `project-create`,
            element: <ProjectCreate />,
          },
          { path: `list`, element: <Projects /> },
          {
            path: `service`,
            element: <PreProjects />,
          },
          {
            path: `service/edit/:id`,
            element: <EditPreProjects />,
          },
          {
            path: `service/add-new`,
            element: <AddPreProjects />,
          },
          
            {
            path : "/cms/projects/AddNewSpecification",
            element: <AddNewSpecification  />,
          },
        ],
      },
      {
        path: `applicants`,
        element: <Career />,
      },
      {
        path: `general`,
        children: [


              {
            path: `about`,
            element: <AboutApi />,
          },
          {
            path: `about/addabout`,
            element: <AboutAdd />,
          },
          {
            path: `about/editabout/:id`,
            element: <AboutEdit />,
          },












          {
            path: `managerList`,
            element: <Filemanagermain />,
          },
          {
            path: `assoc/`,
            element: <AssocLists />,
          },
          {
            path: `assoc/:id`,
            element: <Associates />,
          },
          {
            path: `awards`,
            element: <Awards />,
          },
          {
            path: `team`,
            element: <ManagementList />,
          },
          {
            path: `create-team`,
            element: <CreatorTeam />,
          },
          {
            path: `team/:id`,
            element: <Management />,
          },
          {
            path: `social`,
            element: <SocialLinks />,
          },
          {
            path: `social/:id`,
            element: <SocialEdit />,
          },
          {
            path: `addresses`,
            element: <Addresses />,
          },
          {
            path: `profile`,
            element: <ProfileManagement />,
          },
          {
            path: `profile-settings`,
            element: <ProfileSettings />,
          },
        ],
      },
      {
        path: `pages`,
        children: [
          {
            path: `home`,
            element: <Home />,
          },
          {
            path: `slider`,
            element: <AddSlider />,
          },
          {
            path: `slideredit/:id`,
            element: <SliderEdit />,
          },
          {
            path: `web_about`,
            element: <WebAbout />,
          },
          {
            path: `service`,
            element: <WebService />,
          },
          {
            path: `service/create`,
            element: <ServiceCreate />,
          },
          {
            path: `service/edit/:id`,
            element: <ServiceEdit />,
          },
          {
            path: `blog`,
            element: <Blog />,
          },
           {
            path: `web_team`,
            element: <WebTeam />,
          },
          {
            path: `web_team/create`,
            element: <CreateTeam />,
          },
          {
            path: `web_team/edit/:id`,
            element: <EditTeam />,
          },
          {
            path: `contact`,
            element: <Contact />,
          },
          {
            path: `web-career`,
            element: <Career />,
          },
          {
            path: `footer`,
            element: <Footer />,
          },
          {
            path: `store-setting`,
            element: <StoreSetting />,
          },
          {
            path: `testimonials`,
            element: <Testimonials />,
          },
          {
            path: `testimonals/addtestimonals`,
            element: <Addtestimonals />,
          },
          {
            path: `testimonals/edittestimonals/:id`,
            element: <EditTestimonals />,
          },
          {
            path: `enquiry`,
            element: <Enquiry />,
          },
          {
            path: `blogs`,
            element: <Blogs />,
          },
          {
            path: `blogs/addblog`,
            element: <BlogAdd />,
          },
          {
            path: `blogs/editblog/:id`,
            element: <BlogEdit />,
          },
          {
            path: `blogs/category`,
            element: <BlogCategory />,
          },
          {
            path: "web-faq",
            element: <FaqEdit />,
          },
          {
            path: `fact&figure`,
            element: <FactsAndFig />,
          },
          {
            path: `fact&figure/addfact&figure`,
            element: <AddFactAndFigure />,
          },
          {
            path: `fact&figure/editfact&figure/:id`,
            element: <EditFactFig />,
          },
          {
            path: `job_applicant`,
            element: <JobApplicant />,
          },
          {
            path: `career`,
            element: <DCareer />,
          },
          {
            path: `career/addcareer`,
            element: <AddCareer />,
          },
          {
            path: `buyers-guide`,
            element: <BuyersGuide />,
          },
          {
            path: `buyers-guide/add-buyers-guide`,
            element: <BuyersAdd />,
          },
          {
            path: `buyers-guide/edit-buyers-guide/:id`,
            element: <BuyersEdit />,
          },

  
          {
            path: `sub_categoryid`,
            element: <SubCategoryProject />,
          },
          {
            path: `sub_categoryid/addsub_categoryid`,
            element: <AddSubCategoryProject />,
          },
          // {
          //   path: `sub_categoryid/editsub_categoryid/:id`,
          //   element: <EditSubCategoryProject/>,
          // },
        ],
      },
    ],
    errorElement: <Error404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
