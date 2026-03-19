import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const WebTeam = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    banner_img: "",
    slider1_title: "",
    slider1_img: "",
    slider2_title: "",
    slider2_img: "",
    img_title: "",
    image: "",
    meta_title: "",
    meta_des: "",
    status: 1
  });


  const [bannerImage, setBannerImage] = useState([]);
  const [sliderImage1, setSliderImage1] = useState([]);
  const [sliderImage2, setSliderImage2] = useState([]);
  const [image, setImage] = useState([]);

  const [managerOpener, setManagerOpener] = useState(false);

  // Teams section
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  const fetchData = () => {
    // Fetch web_team data
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallwebteam`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Team data received:", data);
        if (data.status && data.data && data.data.length > 0) {
          const teamData = data.data[0];

          // Parse arrays from JSON strings
          let bannerImageData = [];

          try {
            if (teamData.banner_img) {
              bannerImageData = JSON.parse(teamData.banner_img);

            }
          } catch (parseError) {
            console.warn("Error parsing JSON fields:", parseError);
          }

          setBannerImage(bannerImageData);

          let sliderImageData1 = [];

          try {
            if (teamData.slider1_img) {
              const parsed = JSON.parse(teamData.slider1_img);
              sliderImageData1 = Array.isArray(parsed) ? parsed : [];
            }
          } catch (e) {
            sliderImageData1 = [];
          }

          setSliderImage1(sliderImageData1);

          let sliderImageData2 = [];

          try {
            if (teamData.slider2_img) {
              const parsed = JSON.parse(teamData.slider2_img);
              sliderImageData2 = Array.isArray(parsed) ? parsed : [];
            }
          } catch (e) {
            sliderImageData2 = [];
          }

          setSliderImage2(sliderImageData2);

          let image = [];

          try {
            if (teamData.image) {
              const parsed = JSON.parse(teamData.image);
              image = Array.isArray(parsed) ? parsed : [];
            }
          } catch (e) {
            image = [];
          }

          setImage(image);


          setValues({
            banner_img: teamData.banner_img || "",
            slider1_title: teamData.slider1_title || "",
            slider1_img: teamData.slider1_img || "",
            slider2_title: teamData.slider2_title || "",
            slider2_img: teamData.slider2_img || "",
            img_title: teamData.img_title || "",
            image: teamData.image || "",
            meta_title: teamData.meta_title || "",
            meta_des: teamData.meta_des || "",
            status: teamData.status ?? 1
          });

        } else {
          console.log("No team data found, using defaults");
          setValues({
            banner_img: "",
            slider1_title: "",
            slider1_img: "",
            slider2_title: "",
            slider2_img: "",
            img_title: "",
            image: "",
            meta_title: "",
            meta_des: "",
            status: 1
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch team data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Update values when image states change
  useEffect(() => {
    if (bannerImage && bannerImage.length > 0) {
      setValues(prev => ({ ...prev, banner_img: JSON.stringify(bannerImage) }));
    } else {
      setValues(prev => ({ ...prev, banner_img: "" }));
    }
  }, [bannerImage]);

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      slider1_img: sliderImage1.length > 0 ? sliderImage1 : ""
    }));
  }, [sliderImage1]);

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      slider2_img: sliderImage2.length > 0 ? sliderImage2 : ""
    }));
  }, [sliderImage2]);

  useEffect(() => {
    if (image && image.length > 0) {
      setValues(prev => ({ ...prev, image: JSON.stringify(image) }));
    } else {
      setValues(prev => ({ ...prev, image: "" }));
    }
  }, [image]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidwebteam/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Team page updated successfully");
        fetchData();
      } else {
        toast.error("Failed to update team page");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating");
    }
  };

  // Fetch teams
  const fetchTeams = () => {
    setTeamsLoading(true);
    console.log("Fetching teams from:", `${import.meta.env.VITE_CMS_URL}api/getallteam`);
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallteam`)
      .then((res) => {
        console.log("Team response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Teams received:", data);
        if (data.status && data.data) {
          console.log("Teams data:", data.data);
          setTeams(data.data);
        } else {
          console.log("No teams data found");
          setTeams([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        toast.error("Failed to fetch teams: " + err.message);
        setTeams([]);
      })
      .finally(() => {
        setTeamsLoading(false);
      });
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidteam/${teamId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success("Team deleted successfully");
          fetchTeams();
        } else {
          toast.error("Failed to delete team");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting team");
      }
    }
  };


  // Navigate to add new team page
  const handleAddNewTeam = () => {
    navigate("/cms/pages/web_team/create");
  };

  // Navigate to edit team page
  const handleEditTeam = (team) => {
    console.log("Edit team clicked:", team);
    console.log("Team ID:", team.id);
    navigate(`/cms/pages/web_team/edit/${team.id}`);
  };


  // Initialize teams and members on component mount
  useEffect(() => {
    fetchTeams();
  }, []);


  const handleFileManagerClose = () => setManagerOpener(null);


  // FileManager popups

  if (managerOpener === 1)
    return (
      <Filemanagermain
        file={bannerImage}
        fileSetter={setBannerImage}
        openSetter={handleFileManagerClose}
        maxFiles={1}
        ratio={16 / 9}
        type="image"
      />

    );

  if (managerOpener === 2)
    return (
      <Filemanagermain
        file={sliderImage1}
        fileSetter={setSliderImage1}
        openSetter={handleFileManagerClose}
        maxFiles={5}
        ratio={16 / 9}
        type="image"
      />
    );

  if (managerOpener === 3)
    return (
      <Filemanagermain
        file={sliderImage2}
        fileSetter={setSliderImage2}
        openSetter={handleFileManagerClose}
        maxFiles={5}
        ratio={16 / 9}
        type="image"
      />
    );

  if (managerOpener === 4)
    return (
      <Filemanagermain
        file={image}
        fileSetter={setImage}
        openSetter={handleFileManagerClose}
        maxFiles={5}
        ratio={16 / 9}
        type="image"
      />
    );
  return (
    <div>
      <PageHeader currentpage="Web Team" activepage="Pages" mainpage="Web Team" />
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column */}
        <div className="col-span-12 xxl:col-span-12">
          {/* Hero Section */}
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Hero Section</h5>
            </div>
            <div className="box-body space-y-5">
              {/* Hero Title */}
              <div>
                <label className="ti-form-label">Footer Image Title</label>
                <input
                  type="text"
                  name="img_title"
                  value={values.img_title || ""}
                  onChange={handleInputChange}
                  className="ti-form-input"
                  placeholder="Enter Footer Image Title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Group Image */}
                <div>
                  <label className="ti-form-label">Banner Image</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="ti-btn ti-btn-outline-primary w-full"
                      onClick={() => setManagerOpener(1)}
                    >
                      {bannerImage.length > 0 ? "Change Banner Image" : "Select Banner Image"}
                    </button>
                    {bannerImage.length > 0 && (
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${bannerImage[0]}`}
                          className="w-full h-32 rounded-sm object-cover border"
                          alt="Group"
                        />
                        <button
                          type="button"
                          onClick={() => setBannerImage([])}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="ti-form-label">Footer Image</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="ti-btn ti-btn-outline-primary w-full"
                      onClick={() => setManagerOpener(4)}
                    >
                      {image.length > 0 ? "Change Image" : "Select Image"}
                    </button>
                    {image.length > 0 && (
                      <div className="relative">
                        <img
                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${image[0]}`}
                          className="w-full h-32 rounded-sm object-cover border"
                          alt="Group"
                        />
                        <button
                          type="button"
                          onClick={() => setImage([])}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>



            </div>
          </div>

          {/* Team Section */}
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Team Section</h5>
            </div>
            <div className="box-body space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Team Title */}
                <div>
                  <label className="ti-form-label">Slider1 Section Title</label>
                  <input
                    type="text"
                    name="slider1_title"
                    value={values.slider1_title || ""}
                    onChange={handleInputChange}
                    className="ti-form-input"
                    placeholder="Enter Slider1 Section Title"
                  />
                </div>

                {/* Card Title */}
                <div>
                  <label className="ti-form-label">Slider2 Section Title</label>
                  <input
                    type="text"
                    name="slider2_title"
                    value={values.slider2_title || ""}
                    onChange={handleInputChange}
                    className="ti-form-input"
                    placeholder="Enter Slider2 Section Title"
                  />
                </div>
              </div>
              {/* Group Image */}
              <div>
                <label className="ti-form-label">Slider1 Images</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-primary w-full"
                    onClick={() => setManagerOpener(2)}
                  >
                    {sliderImage1.length > 0 ? "Change Slider Images" : "Select Slider Images"}
                  </button>
                  {sliderImage1.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {sliderImage1.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                            className="w-full h-32 rounded-sm object-cover border"
                            alt="Group"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSliderImage1(sliderImage.filter((_, i) => i !== index))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white
                     rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}


                </div>
              </div>






              <div>
                <label className="ti-form-label">Slider2 Images</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-primary w-full"
                    onClick={() => setManagerOpener(3)}
                  >
                    {sliderImage2.length > 0 ? "Change Slider Images" : "Select Slider Images"}
                  </button>
                  {sliderImage2.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {sliderImage2.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                            className="w-full h-32 rounded-sm object-cover border"
                            alt="Group"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSliderImage2(sliderImage2.filter((_, i) => i !== index))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white
                     rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}


                </div>
              </div>

            </div>
          </div>

          {/* Status */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Status</label>
              <Select
                classNamePrefix="react-select"
                value={{
                  value: values.status,
                  label: values.status === 1 ? "Enable" : "Disable"
                }}
                options={[
                  { value: 1, label: "Enable" },
                  { value: 0, label: "Disable" },
                ]}
                onChange={(selected) =>
                  setValues((prev) => ({ ...prev, status: selected.value }))
                }
              />
            </div>
          </div>

          {/* Meta Title */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={values.meta_title || ""}
                onChange={handleInputChange}
                className="ti-form-input"
                placeholder="Enter Meta Title"
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Meta Description</label>
              <textarea
                name="meta_des"
                value={values.meta_des || ""}
                onChange={handleInputChange}
                className="ti-form-input"
                placeholder="Enter Meta Description"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Content Management */}
      <div className="grid grid-cols-12 gap-x-6 mt-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="flex justify-between items-center w-full">
                <h5 className="box-title">Team Content Management</h5>
                <button
                  type="button"
                  onClick={handleAddNewTeam}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Team
                </button>
              </div>
            </div>
            <div className="box-body">
              {teamsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading teams...</span>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No teams found. Click "Add New Team" to create your first team.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          IMAGE
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          NAME
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          designation
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {teams.map((team, index) => (
                        <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4">
                            {team.image ? (
                              (() => {
                                try {
                                  const teamImages = JSON.parse(team.image);
                                  const imageUrl = Array.isArray(teamImages) ? teamImages[0] : team.image;
                                  return (
                                    <img
                                      className="h-12 w-16 rounded object-cover"
                                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${imageUrl}`}
                                      alt={team.name}
                                    />
                                  );
                                } catch (e) {
                                  return (
                                    <img
                                      className="h-12 w-16 rounded object-cover"
                                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${team.image}`}
                                      alt={team.name}
                                    />
                                  );
                                }
                              })()
                            ) : (
                              <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {team.name}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {team.designation || '-'}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditTeam(team)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(team.id)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="grid grid-cols-12 mt-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-footer bg-transparent">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="ti-btn ti-btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WebTeam;
