import React, { useState, useEffect } from "react";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Sales = ({ local_varaiable }) => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEnquiries: 0,
    totalBlogs: 0,
    totalUsers: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Quick action shortcuts for the CMS
  const quickActions = [
    {
      title: "Manage Pages",
      icon: "ti ti-file-text",
      color: "bg-primary",
      gradient: "from-blue-500 to-blue-600",
      actions: [
        { name: "Home Page", link: "/cms/pages/home", icon: "ti ti-home", description: "Manage homepage content" },
        { name: "About Page", link: "/cms/pages/web_about", icon: "ti ti-info-circle", description: "Edit about us page" },
        { name: "Service Page", link: "/cms/pages/service", icon: "ti ti-briefcase", description: "Manage services content" },
        { name: "Contact Page", link: "/cms/pages/contact", icon: "ti ti-phone", description: "Update contact information" },
      ]
    },
    
    
  ];

  // Popular shortcuts for quick access
  

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch projects count
      const projectsRes = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallprojects`);
      const projectsData = await projectsRes.json();
      
      // Fetch enquiries count
      const enquiriesRes = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallEnquiry`);
      const enquiriesData = await enquiriesRes.json();
      
      // Fetch blogs count (if available)
      try {
        const blogsRes = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallblog`);
        const blogsData = await blogsRes.json();
        setStats(prev => ({
          ...prev,
          totalBlogs: blogsData?.data?.length || 0
        }));
      } catch (error) {
        console.log("Blogs API not available");
      }

      // Fetch users count
      try {
        const usersRes = await fetch(`${import.meta.env.VITE_CMS_URL}api/getallusers`);
        const usersData = await usersRes.json();
        setStats(prev => ({
          ...prev,
          totalUsers: usersData?.data?.length || 0
        }));
      } catch (error) {
        console.log("Users API not available");
      }

      setStats(prev => ({
        ...prev,
        totalProjects: projectsData?.data?.length || 0,
        totalEnquiries: enquiriesData?.data?.length || 0
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div>
      <PageHeader
        currentpage="Dashboard"
        activepage="Home"
        mainpage="Dashboard"
      />

      {/* Welcome Section */}
      <div className="grid grid-cols-12 gap-x-6 mb-6">
        <div className="col-span-12">
          <div className="box bg-gradient-to-r from-primary to-secondary text-white overflow-hidden relative">
            <div className="box-body">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">Welcome to Omah CMS</h1>
                  <p className="text-white/90 text-lg mb-3">
                    Manage your website content efficiently with our comprehensive dashboard
                  </p>
                  <div className="flex items-center text-white/80 text-sm">
                    <i className="ti ti-calendar mr-2"></i>
                    <span className="mr-4">{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <i className="ti ti-clock mr-2"></i>
                    <span>{currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="relative">
                    <i className="ti ti-dashboard text-8xl text-white/20"></i>
                    <div className="absolute top-0 left-0 animate-pulse">
                      <i className="ti ti-star text-2xl text-yellow-300"></i>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Shortcuts */}
     
      {/* Statistics Cards */}

      {/* Quick Actions Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
          <span className="text-sm text-gray-500">Organize and manage your website content</span>
        </div>
        {quickActions.map((section, index) => (
            <div key={index} className="col-span-12 lg:col-span-6 xl:col-span-6 mb-6">
              <div className="box hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <div className="box-header bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center">
                    <div className={`avatar p-3 rounded-xl bg-gradient-to-r ${section.gradient} shadow-lg ltr:mr-3 rtl:ml-3`}>
                      <i className={`${section.icon} text-lg text-white`}></i>
                    </div>
                    <div>
                      <h5 className="box-title mb-0 text-gray-800">{section.title}</h5>
                      <p className="text-xs text-gray-500">Manage {section.title.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="box-body">
                  <div className="grid grid-cols-1 gap-3">
                    {section.actions.map((action, actionIndex) => (
                      <Link
                        key={actionIndex}
                        to={action.link}
                        className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group hover:shadow-md"
                      >
                        <div className="flex-shrink-0">
                          <i className={`${action.icon} text-lg text-gray-500 group-hover:text-primary transition-colors`}></i>
                        </div>
                        <div className="ltr:ml-3 rtl:mr-3 flex-1">
                          <h6 className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors mb-1">
                            {action.name}
                          </h6>
                          <p className="text-xs text-gray-500 group-hover:text-gray-600">
                            {action.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <i className="ti ti-chevron-right text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div className="grid grid-cols-12 gap-x-6">
          
        </div>
      </div>

      {/* Recent Activity Section */}
     
    </div>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, {})(Sales);
