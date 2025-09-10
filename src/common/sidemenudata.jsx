import React from "react";

//Svg icons of Dashboard

const Dashboardsvg = <i className="ri-home-8-line side-menu__icon"></i>;

const WidgetsSvg = <i className="ri-apps-2-line side-menu__icon"></i>;

const ComponentsSvg = <i className="ri-inbox-line side-menu__icon"></i>;

const PagesSvg = <i className="ri-book-open-line side-menu__icon"></i>;

export const MenuItems = [
  {
    id: 1,
    menutitle: "MAIN",
    Items: [
      {
        id: 2,
        icon: Dashboardsvg,
        path: `/cms`,
        title: "Dashboards",
        type: "link",
        active: false,
        selected: false,
      },

     
      // {
      //   id: 115,
      //   icon: WidgetsSvg,
      //   title: "Projects",
      //   type: "sub",
      //   active: false,
      //   selected: false,
      //   children: [
      //     {
      //       id: 201,
      //       icon: Dashboardsvg,
      //       path: `/cms/projects/list`,
      //       title: "Projects",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //     },
      //     {
      //       id: 202,
      //       icon: Dashboardsvg,
      //       path: `/cms/projects/configs`,
      //       title: "Project Configurations",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //     },
      //     {
      //       id: 203,
      //       icon: Dashboardsvg,
      //       path: `/cms/projects/service`,
      //       title: "Service",
      //       type: "link",
      //       active: false,
      //       selected: false,
      //     },
      //   ],
      // },
      // {
      //   id: 333,
      //   icon: Dashboardsvg,
      //   path: `/cms/logs`,
      //   title: "Logs",
      //   type: "link",
      //   active: false,
      //   selected: false,
      // },
    ],
  },
  
  {
    menutitle: "Webcontents",
    Items: [
      {
        id: 16,
        icon: ComponentsSvg,
        title: "General",
        type: "sub",
        active: false,
        selected: false,
        children: [
             
          {
            id: 17,
            path: `/cms/pages/store-setting`,
            type: "link",
            active: false,
            selected: false,
            title: "Store Setting",
          },
       
       
          {
            id: 19,
            path: `/cms/pages/enquiry`,
            type: "link",
            active: false,
            selected: false,
            title: "Enquiry",
          },
      
         
          // {
          //   id: 116,
          //   path: `/cms/general/team`,
          //   title: "Management",
          //   type: "link",
          //   active: false,
          //   selected: false,
          // },

       
              {
            id: 87,
            path: `/cms/general/addresses`,
            title: "Address",
            type: "link",
            active: false,
            selected: false,
          },
          //    {
          //   id: 90,
          //   path: `/cms/general/about`,
          //   title: "About",
          //   type: "link",
          //   active: false,
          //   selected: false,
          // },
        
     
       
        ],
      },
      {
        id: 86,
        icon: PagesSvg,
        title: "Pages",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            id: 87,
            path: `/cms/pages/home`,
            title: "Home",
            type: "link",
            active: false,
            selected: false,
          },
          {
            id: 90,
            path: `/cms/pages/web_about`,
            title: "Web_About",
            type: "link",
            active: false,
            selected: false,
          },
  
          {
            id: 97,

            path: `/cms/pages/contact`,
            title: "Contact",
            type: "link",
            active: false,
            selected: false,
          },
          // {
          //   id: 101,
          //   path: `/cms/pages/web-career`,
          //   title: "Career",
          //   type: "link",
          //   active: false,
          //   selected: false,
          // },
   
          {
            id: 114,
            path: `/cms/pages/footer`,
            title: "Footer",
            type: "link",
            active: false,
            selected: false,
          },
        
          {
            id: 115,
            path: `/cms/pages/service`,
            title: "Service",
            type: "link",
            active: false,
            selected: false,
          },
        ],
      },
    ],
  },
];
export default MenuItems;
