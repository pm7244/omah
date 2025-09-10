import React, { useEffect, useState } from "react";
import Select from "react-select";
import PageHeader from "../../../layout/layoutsection/pageHeader/pageHeader";
import { toast } from "react-toastify";
import Filemanagermain from "../fileManager/filemanagermain";

const Home = () => {
  const [values, setValues] = useState({
    video: "",
    hero_title: "",
    hero_sub_title: "",
    hero_text: "",
    meta_title: "",
    meta_des: "",
    status: 1
  });
  const [video, setVideo] = useState([]);
  const [managerOpener, setManagerOpener] = useState(false);

  // Content management states
  const [contentData, setContentData] = useState([]);
  const [showContentForm, setShowContentForm] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    content_type: "",
    // Image1 fields (only 1 image)
    image1: [],
    image1_title: "",
    image1_des: "",
    image1_btn: "",
    image1_url: "",
    // Image2 fields (2 separate image sections)
    image_2: [],
    image2_title: "",
    image2_des: "",
    image2_btn: "",
    image2_url: "",
    // Text-Image fields (text + 1 image)
    text_title: "",
    text_des: "",
    text_btn: "",
    text_url: "",
  });
  const [contentImage1, setContentImage1] = useState([]);
  const [contentImage2, setContentImage2] = useState([]);
  const [contentImageText, setContentImageText] = useState([]);
  const [editingContentIndex, setEditingContentIndex] = useState(null);

  // Content type options
  const contentTypeOptions = [
    { value: "image1", label: "Image 1 (Single Image)" },
    { value: "image2", label: "Image 2 (Two Images)" },
    { value: "text-image", label: "Text with Image" },
  ];

  const fetchData = () => {
    // Fetch main home data
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallhome`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Home data received:", data);
        if (data.status && data.data && data.data.length > 0) {
          const homeData = data.data[0];
          let videoData = [];
          
          // Parse video data if it exists
          if (homeData.video) {
            try {
              videoData = JSON.parse(homeData.video);
            } catch (e) {
              videoData = [homeData.video];
            }
          }
          
          setVideo(videoData);
          setValues({
            video: homeData.video || "",
            hero_title: homeData.hero_title || "",
            hero_sub_title: homeData.hero_sub_title || "",
            hero_text: homeData.hero_text || "",
            meta_title: homeData.meta_title || "",
            meta_des: homeData.meta_des || "",
            status: homeData.status || 1
          });
        } else {
          console.log("No home data found, using defaults");
          setValues({
            video: "",
            hero_title: "",
            hero_sub_title: "",
            hero_text: "",
            meta_title: "",
            meta_des: "",
            status: 1
          });
          setVideo([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching home data:", err);
        toast.error(`Failed to fetch home data: ${err.message}`);
      });

    // Fetch home content data
    fetch(`${import.meta.env.VITE_CMS_URL}api/getallhomecontent`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Home content data received:", data);
        if (data.status && data.data) {
          setContentData(data.data);
        } else {
          console.log("No content data found or invalid response structure");
          setContentData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching content data:", err);
        toast.error(`Failed to fetch content data: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update video in values when array changes
  useEffect(() => {
    if (video && video.length > 0) {
      setValues(prev => ({ ...prev, video: JSON.stringify(video) }));
    } else {
      setValues(prev => ({ ...prev, video: "" }));
    }
  }, [video]);

  // Update content images in current content when image arrays change
  useEffect(() => {
    setCurrentContent(prev => ({
      ...prev,
      image1: contentImage1,
      image_2: contentImage2
    }));
  }, [contentImage1, contentImage2]);

  // Content management functions
  const handleContentTypeChange = (selectedOption) => {
    setCurrentContent({
      content_type: selectedOption.value,
      image1: [],
      image1_title: "",
      image1_des: "",
      image1_btn: "",
      image1_url: "",
      image_2: [],
      image2_title: "",
      image2_des: "",
      image2_btn: "",
      image2_url: "",
      text_title: "",
      text_des: "",
      text_btn: "",
      text_url: "",
    });
    setContentImage1([]);
    setContentImage2([]);
    setContentImageText([]);
    setShowContentForm(true);
    setEditingContentIndex(null);
  };

  const handleContentInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContent = () => {
    if (!currentContent.content_type) {
      toast.error("Please select a content type");
      return;
    }

    // Validation based on content type
    if (currentContent.content_type === "image1") {
      if (contentImage1.length !== 1) {
        toast.error("Please upload 1 image for Image1 type");
        return;
      }
      if (!currentContent.image1_title.trim()) {
        toast.error("Please enter Image1 title");
        return;
      }
    }

    if (currentContent.content_type === "image2") {
      if (contentImage1.length !== 1 || contentImage2.length !== 1) {
        toast.error("Please upload exactly 1 image for each section in Image2 type");
        return;
      }
      if (!currentContent.image1_title.trim() || !currentContent.image2_title.trim()) {
        toast.error("Please enter titles for both images");
        return;
      }
    }

    if (currentContent.content_type === "text-image") {
      if (!currentContent.text_title.trim()) {
        toast.error("Please enter text title");
        return;
      }
      if (contentImageText.length !== 1) {
        toast.error("Please upload 1 image for Text-Image type");
        return;
      }
    }

    // Create content payload matching database structure
    const contentPayload = {
      type: currentContent.content_type,
      image1: currentContent.content_type === "image1" 
        ? JSON.stringify(contentImage1) 
        : currentContent.content_type === "text-image" 
        ? JSON.stringify(contentImageText)
        : currentContent.content_type === "image2"
        ? JSON.stringify(contentImage1)
        : "",
      image1_title: currentContent.image1_title || "",
      image1_des: currentContent.image1_des || "",
      image1_btn: currentContent.image1_btn || "",
      image1_url: currentContent.image1_url || "",
      image_2: currentContent.content_type === "image2" ? JSON.stringify(contentImage2) : "",
      image2_title: currentContent.image2_title || "",
      image2_des: currentContent.image2_des || "",
      image2_btn: currentContent.image2_btn || "",
      image2_url: currentContent.image2_url || "",
      text_title: currentContent.text_title || "",
      text_des: currentContent.text_des || "",
      text_btn: currentContent.text_btn || "",
      text_url: currentContent.text_url || "",
      status: 1
    };

    // API call
    const apiUrl = editingContentIndex !== null && contentData[editingContentIndex]?.hc_id
      ? `${import.meta.env.VITE_CMS_URL}api/updatebyidhomecontent/${contentData[editingContentIndex].hc_id}`
      : `${import.meta.env.VITE_CMS_URL}api/createhomecontent`;
      
    const method = editingContentIndex !== null && contentData[editingContentIndex]?.hc_id ? "PUT" : "POST";

    fetch(apiUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contentPayload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          toast.success(editingContentIndex !== null ? "Content updated successfully" : "Content added successfully");
          fetchData(); // Refresh data
          resetContentForm();
        } else {
          toast.error(result.message || "Failed to save content");
        }
      })
      .catch((err) => {
        console.error("Content save error:", err);
        toast.error("Failed to save content");
      });
  };

  const resetContentForm = () => {
    setCurrentContent({
      content_type: "",
      image1: [],
      image1_title: "",
      image1_des: "",
      image1_btn: "",
      image1_url: "",
      image_2: [],
      image2_title: "",
      image2_des: "",
      image2_btn: "",
      image2_url: "",
      text_title: "",
      text_des: "",
      text_btn: "",
      text_url: "",
    });
    setContentImage1([]);
    setContentImage2([]);
    setContentImageText([]);
    setShowContentForm(false);
    setEditingContentIndex(null);
  };

  const handleEditContent = (index) => {
    const item = contentData[index];
    setCurrentContent({
      content_type: item.type,
      image1_title: item.image1_title || "",
      image1_des: item.image1_des || "",
      image1_btn: item.image1_btn || "",
      image1_url: item.image1_url || "",
      image2_title: item.image2_title || "",
      image2_des: item.image2_des || "",
      image2_btn: item.image2_btn || "",
      image2_url: item.image2_url || "",
      text_title: item.text_title || "",
      text_des: item.text_des || "",
      text_btn: item.text_btn || "",
      text_url: item.text_url || "",
    });
    
    // Parse and set images based on content type
    try {
      if (item.type === "image1") {
        const image1Data = item.image1 ? JSON.parse(item.image1) : [];
        setContentImage1(image1Data);
        setContentImage2([]);
        setContentImageText([]);
      } else if (item.type === "image2") {
        const image1Data = item.image1 ? JSON.parse(item.image1) : [];
        const image2Data = item.image_2 ? JSON.parse(item.image_2) : [];
        setContentImage1(image1Data);
        setContentImage2(image2Data);
        setContentImageText([]);
      } else if (item.type === "text-image") {
        const imageData = item.image1 ? JSON.parse(item.image1) : [];
        setContentImage1([]);
        setContentImage2([]);
        setContentImageText(imageData);
      }
    } catch (e) {
      console.error("Error parsing images:", e);
      setContentImage1([]);
      setContentImage2([]);
      setContentImageText([]);
    }
    
    setEditingContentIndex(index);
    setShowContentForm(true);
  };

  const handleMoveContent = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= contentData.length) {
      return; // Can't move beyond boundaries
    }

    // Create a copy of the array and swap items
    const updatedContent = [...contentData];
    [updatedContent[index], updatedContent[newIndex]] = [updatedContent[newIndex], updatedContent[index]];
    
    // Update local state immediately for UI feedback
    setContentData(updatedContent);

    // Update sort_order in database for both items
    try {
      const item1 = updatedContent[index];
      const item2 = updatedContent[newIndex];
      
      if (item1.hc_id && item2.hc_id) {
        // Prepare complete data for both items
        const updateData1 = {
          type: item1.type,
          image1: item1.image1 || "[]",
          image1_title: item1.image1_title || "",
          image1_des: item1.image1_des || "",
          image1_btn: item1.image1_btn || "",
          image1_url: item1.image1_url || "",
          image_2: item1.image_2 || "[]",
          image2_title: item1.image2_title || "",
          image2_des: item1.image2_des || "",
          image2_btn: item1.image2_btn || "",
          image2_url: item1.image2_url || "",
          text_title: item1.text_title || "",
          text_des: item1.text_des || "",
          text_btn: item1.text_btn || "",
          text_url: item1.text_url || "",
          sort_order: (newIndex + 1).toString(),
          status: item1.status || 1
        };

        const updateData2 = {
          type: item2.type,
          image1: item2.image1 || "[]",
          image1_title: item2.image1_title || "",
          image1_des: item2.image1_des || "",
          image1_btn: item2.image1_btn || "",
          image1_url: item2.image1_url || "",
          image_2: item2.image_2 || "[]",
          image2_title: item2.image2_title || "",
          image2_des: item2.image2_des || "",
          image2_btn: item2.image2_btn || "",
          image2_url: item2.image2_url || "",
          text_title: item2.text_title || "",
          text_des: item2.text_des || "",
          text_btn: item2.text_btn || "",
          text_url: item2.text_url || "",
          sort_order: (index + 1).toString(),
          status: item2.status || 1
        };

        // Update sort_order for both items
        const promises = [
          fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidhomecontent/${item1.hc_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData1),
          }),
          fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidhomecontent/${item2.hc_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData2),
          })
        ];
        
        const results = await Promise.all(promises);
        const allSuccessful = results.every(response => response.ok);
        
        if (allSuccessful) {
          toast.success(`Content moved ${direction} successfully`);
          fetchContentData(); // Refresh to get updated order from database
        } else {
          throw new Error('Failed to update database');
        }
      }
    } catch (error) {
      console.error("Error updating content order:", error);
      toast.error("Failed to update content order");
      // Revert local state on error
      fetchContentData();
    }
  };

  const handleDeleteContent = (index) => {
    const item = contentData[index];
    if (!item?.hc_id) {
      toast.error("Content ID not found");
      return;
    }
    if (window.confirm("Are you sure you want to delete this content?")) {
      fetch(`${import.meta.env.VITE_CMS_URL}api/deletebyidhomecontent/${item.hc_id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status) {
            toast.success("Content deleted successfully");
            fetchData();
          } else {
            toast.error(result.message || "Failed to delete content");
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error("Failed to delete content");
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Updated Home Data Submission
  const handleSubmit = () => {
    // Send home fields to backend
    const payload = {
      video: JSON.stringify(video),
      hero_title: values.hero_title,
      hero_sub_title: values.hero_sub_title,
      hero_text: values.hero_text,
      meta_title: values.meta_title,
      meta_des: values.meta_des,
      status: values.status
    };
    
    fetch(`${import.meta.env.VITE_CMS_URL}api/updatebyidhome/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          toast.success("Home page updated successfully");
          fetchData();
        } else {
          toast.error(result.message || "Failed to update home page");
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update home page");
      });
  };

  return managerOpener === 2 ? (
    <Filemanagermain
      file={video}
      fileSetter={setVideo}
      openSetter={setManagerOpener}
    />
  ) : managerOpener === 3 ? (
    <Filemanagermain
      file={contentImage1}
      fileSetter={setContentImage1}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : managerOpener === 4 ? (
    <Filemanagermain
      file={contentImage2}
      fileSetter={setContentImage2}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : managerOpener === 5 ? (
    <Filemanagermain
      file={contentImageText}
      fileSetter={setContentImageText}
      openSetter={setManagerOpener}
      maxFiles={1}
      ratio={16 / 9}
      type="image"
    />
  ) : (
    <div>
      <PageHeader currentpage="Home" activepage="Pages" mainpage="Home" />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 xxl:col-span-8">
          {/* Hero Title */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label text-dark-grey">Hero Title</label>
              <input
                type="text"
                name="hero_title"
                value={values.hero_title || ""}
                onChange={handleInputChange}
                className="ti-form-input"
                placeholder="Enter Hero Title"
              />
            </div>
          </div>

          {/* Hero Sub Title */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Hero Sub Title</label>
              <input
                type="text"
                name="hero_sub_title"
                value={values.hero_sub_title || ""}
                onChange={handleInputChange}
                className="ti-form-input"
                placeholder="Enter Hero Sub Title"
              />
            </div>
          </div>

          {/* Hero Text */}
          <div className="box">
            <div className="box-body space-y-5">
              <label className="ti-form-label">Hero Text</label>
              <textarea
                name="hero_text"
                value={values.hero_text || ""}
                onChange={handleInputChange}
                className="ti-form-input"
                placeholder="Enter Hero Text"
                rows="4"
              />
            </div>
          </div>

          {/* Video Section */}
          <div className="box">
            <div className="box-header">Video</div>
            <div className="box-body space-y-4">
              {video && video.length > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="ti-btn ti-btn-outline-primary"
                      onClick={() => setManagerOpener(2)}
                    >
                      Change Video
                    </button>
                    <button
                      type="button"
                      className="ti-btn ti-btn-outline-danger"
                      onClick={() => {
                        setVideo([]);
                        setValues(prev => ({ ...prev, video: "" }));
                        toast.success("Video removed successfully");
                      }}
                    >
                      Remove Video
                    </button>
                  </div>
                  <video controls className="box-img-top h-52 rounded-t-sm">
                    <source
                      src={`${import.meta.env.VITE_CMS_URL}api/transform/${video[0]}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </>
              ) : (
                <button
                  type="button"
                  className="ti-btn ti-btn-outline-primary"
                  onClick={() => setManagerOpener(2)}
                >
                  Add Video
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 xxl:col-span-4">
          {/* Status */}
          <div className="box">
            <div className="box-header">
              <h5 className="box-title">Status</h5>
            </div>
            <div className="box-body">
              <Select
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

      {/* Content Management Section */}
      <div className="grid grid-cols-12 gap-x-6 mt-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-header flex justify-between items-center">
              <h5 className="box-title">Content Management</h5>
              <button
                type="button"
                onClick={() => {
                  setShowContentForm(true);
                  setEditingContentIndex(null);
                }}
                className="ti-btn ti-btn-primary"
              >
                <i className="ti ti-plus mr-2"></i>Add New Content
              </button>
            </div>

            {/* Content Form */}
            {showContentForm && (
              <div className="box-body border-b">
                <div className="grid grid-cols-12 gap-4">
                  {/* Content Type Selection */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <label className="ti-form-label text-sm font-medium">
                      Content Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={contentTypeOptions.find(opt => opt.value === currentContent.content_type)}
                      onChange={handleContentTypeChange}
                      options={contentTypeOptions}
                      placeholder="Select content type..."
                      className="text-sm"
                    />
                  </div>

                  {/* Dynamic Fields based on Content Type */}
                  {currentContent.content_type && (
                    <div className="col-span-12">
                      <div className="grid grid-cols-12 gap-4">
                        
                        {/* IMAGE1 TYPE FIELDS - Only image1 fields */}
                        {currentContent.content_type === "image1" && (
                          <>
                            {/* Image1 Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(3)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage1.length > 0 ? "Change Image" : "Select Image"}
                                </button>
                                {contentImage1.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage1.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage1([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Image1 Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image1_title"
                                value={currentContent.image1_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image title..."
                              />
                            </div>

                            {/* Image1 Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Description
                              </label>
                              <textarea
                                name="image1_des"
                                value={currentContent.image1_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image description..."
                                rows="3"
                              />
                            </div>

                            {/* Image1 Button */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Button Text
                              </label>
                              <input
                                type="text"
                                name="image1_btn"
                                value={currentContent.image1_btn}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter button text..."
                              />
                            </div>

                            {/* Image1 URL */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Button URL
                              </label>
                              <input
                                type="url"
                                name="image1_url"
                                value={currentContent.image1_url}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter button URL..."
                              />
                            </div>
                          </>
                        )}

                        {/* IMAGE2 TYPE FIELDS - Two separate image sections in one form */}
                        {currentContent.content_type === "image2" && (
                          <>
                            {/* First Image Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 border-b pb-2">First Image Section</h6>
                            </div>
                            
                            {/* First Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload First Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(3)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage1.length > 0 ? "Change First Image" : "Select First Image"}
                                </button>
                                {contentImage1.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage1.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage1([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* First Image Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image1_title"
                                value={currentContent.image1_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image title..."
                              />
                            </div>

                            {/* First Image Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Description
                              </label>
                              <textarea
                                name="image1_des"
                                value={currentContent.image1_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image description..."
                                rows="3"
                              />
                            </div>

                            {/* First Image Button */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Button Text
                              </label>
                              <input
                                type="text"
                                name="image1_btn"
                                value={currentContent.image1_btn}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image button text..."
                              />
                            </div>

                            {/* First Image URL */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                First Image Button URL
                              </label>
                              <input
                                type="url"
                                name="image1_url"
                                value={currentContent.image1_url}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter first image button URL..."
                              />
                            </div>

                            {/* Second Image Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 mt-6 border-b pb-2">Second Image Section</h6>
                            </div>
                            
                            {/* Second Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Second Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(4)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImage2.length > 0 ? "Change Second Image" : "Select Second Image"}
                                </button>
                                {contentImage2.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImage2.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImage2([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Second Image Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image2_title"
                                value={currentContent.image2_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image title..."
                              />
                            </div>

                            {/* Second Image Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Description
                              </label>
                              <textarea
                                name="image2_des"
                                value={currentContent.image2_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image description..."
                                rows="3"
                              />
                            </div>

                            {/* Second Image Button */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Button Text
                              </label>
                              <input
                                type="text"
                                name="image2_btn"
                                value={currentContent.image2_btn}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image button text..."
                              />
                            </div>

                            {/* Second Image URL */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Second Image Button URL
                              </label>
                              <input
                                type="url"
                                name="image2_url"
                                value={currentContent.image2_url}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter second image button URL..."
                              />
                            </div>
                          </>
                        )}

                        {/* TEXT-IMAGE TYPE FIELDS - Shows text fields and image1 fields */}
                        {currentContent.content_type === "text-image" && (
                          <>
                            {/* Text Fields Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700">Text Section</h6>
                            </div>
                            
                            {/* Text Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="text_title"
                                value={currentContent.text_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text title..."
                              />
                            </div>

                            {/* Text Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text Description
                              </label>
                              <textarea
                                name="text_des"
                                value={currentContent.text_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text description..."
                                rows="3"
                              />
                            </div>

                            {/* Text Button */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text Button
                              </label>
                              <input
                                type="text"
                                name="text_btn"
                                value={currentContent.text_btn}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text button..."
                              />
                            </div>

                            {/* Text URL */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Text URL
                              </label>
                              <input
                                type="url"
                                name="text_url"
                                value={currentContent.text_url}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter text URL..."
                              />
                            </div>

                            {/* Image Fields Section */}
                            <div className="col-span-12">
                              <h6 className="text-sm font-semibold mb-3 text-gray-700 mt-4">Image Section</h6>
                            </div>

                            {/* Image Upload */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Upload Image <span className="text-red-500">*</span>
                              </label>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setManagerOpener(5)}
                                  className="ti-btn ti-btn-outline-primary ti-btn-sm w-full"
                                >
                                  {contentImageText.length > 0 ? "Change Image" : "Select Image"}
                                </button>
                                {contentImageText.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {contentImageText.map((img, index) => (
                                      <div key={index} className="relative">
                                        <img
                                          src={`${import.meta.env.VITE_CMS_URL}api/transform/${img}`}
                                          className="h-16 w-20 rounded-sm object-cover border"
                                          alt="Preview"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setContentImageText([])}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Image Title */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="image1_title"
                                value={currentContent.image1_title}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image title..."
                              />
                            </div>

                            {/* Image Description */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Description
                              </label>
                              <textarea
                                name="image1_des"
                                value={currentContent.image1_des}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image description..."
                                rows="3"
                              />
                            </div>

                            {/* Image Button */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image Button
                              </label>
                              <input
                                type="text"
                                name="image1_btn"
                                value={currentContent.image1_btn}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image button..."
                              />
                            </div>

                            {/* Image URL */}
                            <div className="col-span-12 md:col-span-6">
                              <label className="ti-form-label text-sm font-medium">
                                Image URL
                              </label>
                              <input
                                type="url"
                                name="image1_url"
                                value={currentContent.image1_url}
                                onChange={handleContentInputChange}
                                className="ti-form-input text-sm"
                                placeholder="Enter image URL..."
                              />
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        <div className="col-span-12 flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            onClick={handleAddContent}
                            className="ti-btn ti-btn-primary"
                          >
                            {editingContentIndex !== null ? "Update Content" : "Add Content"}
                          </button>
                          <button
                            type="button"
                            onClick={resetContentForm}
                            className="ti-btn ti-btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Table */}
            <div className="overflow-auto table-bordered">
              <table className="ti-custom-table ti-custom-table-head">
                <thead className="border">
                  <tr>
                    <th className="w-1">#</th>
                    <th>Content Type</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Button Text</th>
                    <th>Button URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentData.map((item, index) => (
                    <tr key={item.hc_id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="badge bg-primary text-white px-2 py-1 rounded text-xs">
                          {contentTypeOptions.find(opt => opt.value === item.type)?.label || item.type}
                        </span>
                      </td>
                      <td>
                        {item.type === "image1" && item.image1 ? (
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`}
                            className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                            alt="Content"
                            onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`, '_blank')}
                          />
                        ) : item.type === "image2" && item.image1 ? (
                          <div className="flex gap-1">
                            <img
                              src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`}
                              className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                              alt="Content 1"
                              onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`, '_blank')}
                            />
                            {item.image_2 && (
                              <img
                                src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image_2)[0]}`}
                                className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                                alt="Content 2"
                                onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image_2)[0]}`, '_blank')}
                              />
                            )}
                          </div>
                        ) : item.type === "text-image" && item.image1 ? (
                          <img
                            src={`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`}
                            className="h-12 w-16 rounded-sm object-cover border cursor-pointer"
                            alt="Content"
                            onClick={() => window.open(`${import.meta.env.VITE_CMS_URL}api/transform/${JSON.parse(item.image1)[0]}`, '_blank')}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No image</span>
                        )}
                      </td>
                      <td>
                        <div className="max-w-32 truncate text-sm">
                          {item.type === "image1" ? item.image1_title : 
                           item.type === "image2" ? `${item.image1_title} / ${item.image2_title}` :
                           item.type === "text-image" ? item.text_title :
                           "No title"}
                        </div>
                      </td>
                      <td>
                        <div className="max-w-32 truncate text-sm">
                          {item.type === "image1" ? item.image1_des : 
                           item.type === "image2" ? `${item.image1_des} / ${item.image2_des}` :
                           item.type === "text-image" ? item.text_des :
                           "No description"}
                        </div>
                      </td>
                      <td>
                        <div className="max-w-24 truncate text-sm">
                          {item.type === "image1" ? item.image1_btn : 
                           item.type === "image2" ? `${item.image1_btn} / ${item.image2_btn}` :
                           item.type === "text-image" ? item.text_btn :
                           "No button"}
                        </div>
                      </td>
                      <td>
                        <div className="max-w-32 truncate text-sm">
                          {item.type === "image1" && item.image1_url ? (
                            <a href={item.image1_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                              {item.image1_url}
                            </a>
                          ) : item.type === "image2" && (item.image1_url || item.image2_url) ? (
                            <div>
                              {item.image1_url && <a href={item.image1_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 block truncate">{item.image1_url}</a>}
                              {item.image2_url && <a href={item.image2_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 block truncate">{item.image2_url}</a>}
                            </div>
                          ) : item.type === "text-image" && item.text_url ? (
                            <a href={item.text_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                              {item.text_url}
                            </a>
                          ) : (
                            "No URL"
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveContent(index, 'up')}
                            disabled={index === 0}
                            className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Move Up"
                          >
                            <i className="ti ti-arrow-up"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveContent(index, 'down')}
                            disabled={index === contentData.length - 1}
                            className={`ti-btn ti-btn-soft-info ti-btn-sm ${index === contentData.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Move Down"
                          >
                            <i className="ti ti-arrow-down"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditContent(index)}
                            className="ti-btn ti-btn-soft-primary ti-btn-sm"
                            title="Edit"
                          >
                            <i className="ti ti-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteContent(index)}
                            className="ti-btn ti-btn-soft-danger ti-btn-sm"
                            title="Delete"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contentData.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-gray-500 py-8">
                        No content available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

export default Home;
